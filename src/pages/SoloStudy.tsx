import React, { useState, useRef, useEffect } from 'react';
import { 
  ListTodo, Plus, Check, X, Clock, FileText, 
  Save, Upload, Download, Undo, Redo, 
  Square, Circle, Type, Eraser, Pencil,
  Play, Pause, RotateCcw, ChevronLeft, ChevronRight,
  Maximize2, Minimize2, PenTool, Bot, Trash2,
  Edit, Search
} from 'lucide-react';
import { fabric } from 'fabric';
import * as pdfjsLib from 'pdfjs-dist';

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  deadline?: string;
}

interface Note {
  id: string;
  title: string;
  content: string;
  timestamp: string;
  isEditing?: boolean;
}

interface Resource {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'link';
  url: string;
  timestamp: string;
}

function SoloStudy() {
  const [activeTab, setActiveTab] = useState<'whiteboard' | 'pdf' | 'notes'>('whiteboard');
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [currentBreak, setCurrentBreak] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<Note>({ 
    id: '', 
    title: '', 
    content: '', 
    timestamp: '',
    isEditing: false 
  });
  const [resources, setResources] = useState<Resource[]>([]);
  const [currentPdfUrl, setCurrentPdfUrl] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedTool, setSelectedTool] = useState<'pen' | 'shape' | 'text' | 'eraser' | 'delete'>('pen');
  const [penColor, setPenColor] = useState('#000000');
  const [isAiAssistEnabled, setIsAiAssistEnabled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const pdfCanvasRef = useRef<HTMLCanvasElement>(null);
  const notesContentRef = useRef<HTMLDivElement>(null);

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (canvasRef.current && activeTab === 'whiteboard') {
      fabricCanvasRef.current = new fabric.Canvas(canvasRef.current, {
        isDrawingMode: true,
        width: canvasRef.current.parentElement?.clientWidth || 1000,
        height: 500,
        backgroundColor: '#ffffff',
      });
      updateDrawingSettings();
    }
    return () => {
      fabricCanvasRef.current?.dispose();
    };
  }, [activeTab]);

  // Update drawing settings when tool or color changes
  useEffect(() => {
    updateDrawingSettings();
  }, [selectedTool, penColor]);

  // Timer logic
  useEffect(() => {
    let timer: number;
    if (isTimerRunning && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (!currentBreak) {
        setSessionCount((prev) => prev + 1);
        setTimeLeft(5 * 60);
        setCurrentBreak(true);
      } else {
        setTimeLeft(25 * 60);
        setCurrentBreak(false);
      }
      setIsTimerRunning(false);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, timeLeft, currentBreak]);

  const updateDrawingSettings = () => {
    if (!fabricCanvasRef.current) return;

    switch (selectedTool) {
      case 'pen':
        fabricCanvasRef.current.isDrawingMode = true;
        fabricCanvasRef.current.freeDrawingBrush.width = 2;
        fabricCanvasRef.current.freeDrawingBrush.color = penColor;
        fabricCanvasRef.current.selection = false;
        break;
      case 'eraser':
        fabricCanvasRef.current.isDrawingMode = true;
        fabricCanvasRef.current.freeDrawingBrush.width = 20;
        fabricCanvasRef.current.freeDrawingBrush.color = '#ffffff';
        break;
      case 'text':
        fabricCanvasRef.current.isDrawingMode = false;
        fabricCanvasRef.current.selection = true;
        addTextToCanvas();
        break;
      case 'delete':
        fabricCanvasRef.current.isDrawingMode = false;
        fabricCanvasRef.current.selection = true;
        break;
      case 'shape':
        fabricCanvasRef.current.isDrawingMode = false;
        fabricCanvasRef.current.selection = true;
        break;
    }
  };

  const addTextToCanvas = () => {
    if (!fabricCanvasRef.current) return;
    const text = new fabric.IText('Type here...', {
      left: 100,
      top: 100,
      fontFamily: 'Arial',
      fontSize: 20,
      fill: penColor,
    });
    fabricCanvasRef.current.add(text);
    fabricCanvasRef.current.setActiveObject(text);
    fabricCanvasRef.current.renderAll();
  };

  const clearCanvas = () => {
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.clear();
      fabricCanvasRef.current.backgroundColor = '#ffffff';
      fabricCanvasRef.current.renderAll();
    }
  };

  const deleteSelected = () => {
    if (fabricCanvasRef.current) {
      const activeObjects = fabricCanvasRef.current.getActiveObjects();
      activeObjects.forEach(obj => fabricCanvasRef.current?.remove(obj));
      fabricCanvasRef.current.discardActiveObject().renderAll();
    }
  };

  const saveWhiteboardContent = () => {
    if (!fabricCanvasRef.current) return;
    const content = fabricCanvasRef.current.toDataURL({
      format: 'png',
      quality: 0.8
    });
    const note: Note = {
      id: Date.now().toString(),
      title: 'Whiteboard Content',
      content: `<img src="${content}" alt="Whiteboard Content" />`,
      timestamp: new Date().toISOString(),
    };
    setNotes([...notes, note]);
    setActiveTab('notes');
  };

  // PDF handling
  const loadPdf = async (url: string) => {
    const loadingTask = pdfjsLib.getDocument(url);
    const pdf = await loadingTask.promise;
    setTotalPages(pdf.numPages);
    setCurrentPage(1);
    renderPage(pdf, 1);
  };

  const renderPage = async (pdf: pdfjsLib.PDFDocumentProxy, pageNumber: number) => {
    const page = await pdf.getPage(pageNumber);
    const canvas = pdfCanvasRef.current;
    if (!canvas) return;
    const viewport = page.getViewport({ scale: 1.5 });
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    await page.render({
      canvasContext: context!,
      viewport: viewport
    }).promise;
  };

  // Todo management
  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    const todo: Todo = {
      id: Date.now().toString(),
      text: newTodo,
      completed: false,
    };
    setTodos([...todos, todo]);
    setNewTodo('');
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Note management
  const saveNote = () => {
    if (!currentNote.title.trim() || !currentNote.content.trim()) return;
    
    if (currentNote.id) {
      // Update existing note
      setNotes(notes.map(note => 
        note.id === currentNote.id ? { 
          ...currentNote, 
          timestamp: new Date().toISOString(),
          isEditing: false 
        } : note
      ));
    } else {
      // Add new note
      const newNote: Note = {
        id: Date.now().toString(),
        title: currentNote.title,
        content: currentNote.content,
        timestamp: new Date().toISOString(),
      };
      setNotes([newNote, ...notes]);
    }
    
    setCurrentNote({ 
      id: '', 
      title: '', 
      content: '', 
      timestamp: '',
      isEditing: false 
    });
  };

  const editNote = (note: Note) => {
    setCurrentNote({ ...note, isEditing: true });
    setActiveTab('notes');
    setTimeout(() => {
      notesContentRef.current?.focus();
    }, 0);
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
    if (currentNote.id === id) {
      setCurrentNote({ 
        id: '', 
        title: '', 
        content: '', 
        timestamp: '',
        isEditing: false 
      });
    }
  };

  const createNewNote = () => {
    setCurrentNote({ 
      id: '', 
      title: '', 
      content: '', 
      timestamp: '',
      isEditing: true 
    });
    setActiveTab('notes');
    setTimeout(() => {
      const titleInput = document.querySelector('input[placeholder="Note title..."]') as HTMLInputElement;
      titleInput?.focus();
    }, 0);
  };

  // Resource management
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const resource: Resource = {
      id: Date.now().toString(),
      name: file.name,
      type: file.type.includes('pdf') ? 'pdf' : 'image',
      url: URL.createObjectURL(file),
      timestamp: new Date().toISOString(),
    };
    setResources([...resources, resource]);
    if (resource.type === 'pdf') {
      setCurrentPdfUrl(resource.url);
      setActiveTab('pdf');
      loadPdf(resource.url);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const colorOptions = [
    '#000000', '#4F46E5', '#EF4444', '#10B981', '#3B82F6', '#F59E0B'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 p-4 rounded-lg bg-white shadow border border-gray-200">
          <h1 className="text-2xl font-bold text-blue-600">ASUS Vivobook</h1>
          <div className="flex space-x-4">
            <button 
              className={`px-3 py-1 rounded ${activeTab === 'whiteboard' ? 'bg-[#4F46E5] text-white' : 'bg-gray-200 text-gray-700'} hover:bg-[#4F46E5] hover:text-white hover:bg-opacity-80 transition-all`}
              onClick={() => setActiveTab('whiteboard')}
            >
              White Board
            </button>
            <button 
              className={`px-3 py-1 rounded ${activeTab === 'pdf' ? 'bg-[#4F46E5] text-white' : 'bg-gray-200 text-gray-700'} hover:bg-[#4F46E5] hover:text-white hover:bg-opacity-80 transition-all`}
              onClick={() => setActiveTab('pdf')}
            >
              PDF View
            </button>
            <button 
              className={`px-3 py-1 rounded ${activeTab === 'notes' ? 'bg-[#4F46E5] text-white' : 'bg-gray-200 text-gray-700'} hover:bg-[#4F46E5] hover:text-white hover:bg-opacity-80 transition-all`}
              onClick={() => setActiveTab('notes')}
            >
              Notes
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          {/* Left Sidebar - Timer and Tasks */}
          <div className="col-span-3 space-y-4">
            {/* Pomodoro Timer */}
            <div className="p-4 rounded-lg bg-white shadow border border-gray-200 h-64">
              <h2 className="text-lg font-semibold mb-3">Pomodoro Timer</h2>
              <div className="flex flex-col items-center">
                <div className="text-5xl font-bold mb-4">
                  {formatTime(timeLeft)}
                </div>
                <div className="flex space-x-3 mb-2">
                  <button
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className={`p-3 rounded-full ${isTimerRunning ? 'bg-red-500' : 'bg-green-500'} text-white hover:opacity-80 transition-all`}
                  >
                    {isTimerRunning ? <Pause size={20} /> : <Play size={20} />}
                  </button>
                  <button
                    onClick={() => {
                      setTimeLeft(25 * 60);
                      setIsTimerRunning(false);
                      setCurrentBreak(false);
                    }}
                    className="p-3 rounded-full bg-gray-200 hover:bg-[#4F46E5] hover:text-white hover:bg-opacity-80 transition-all"
                  >
                    <RotateCcw size={20} />
                  </button>
                </div>
                <div className="text-sm">
                  <span className="font-medium">Sessions:</span> {sessionCount}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Status:</span> {currentBreak ? 'Break' : 'Focus'}
                </div>
              </div>
            </div>

            {/* To Do List */}
            <div className="p-4 rounded-lg bg-white shadow border border-gray-200 h-96">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold">To Do List</h2>
                <span className="px-2 py-1 rounded-full text-xs bg-gray-200">
                  {todos.filter(t => !t.completed).length} pending
                </span>
              </div>
              
              <form onSubmit={addTodo} className="mb-4">
                <div className="flex">
                  <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="Add Task..."
                    className="flex-1 p-2 rounded-l-md border bg-white border-gray-300"
                  />
                  <button
                    type="submit"
                    className="px-3 rounded-r-md bg-[#4F46E5] text-white hover:bg-opacity-80 transition-all"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </form>
              
              <div className="space-y-2 h-64 overflow-y-auto">
                {todos.map((todo) => (
                  <div
                    key={todo.id}
                    className="flex items-center justify-between p-2 rounded-md bg-gray-100"
                  >
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleTodo(todo.id)}
                        className={`p-1 rounded ${todo.completed ? 'bg-green-500 text-white' : 'bg-gray-300'} hover:bg-[#4F46E5] hover:text-white hover:bg-opacity-80 transition-all`}
                      >
                        <Check size={16} />
                      </button>
                      <span className={`${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                        {todo.text}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="text-red-500 hover:text-red-600 p-1 transition-all"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="col-span-6">
            {/* Whiteboard */}
            {activeTab === 'whiteboard' && (
              <div className="p-4 rounded-lg bg-white shadow border border-gray-200 h-[500px]">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex space-x-2">
                    {/* Pen Tool with Color Options */}
                    <div className="relative group">
                      <button
                        onClick={() => setSelectedTool('pen')}
                        className={`p-2 rounded ${selectedTool === 'pen' ? 'bg-[#4F46E5] text-white' : 'bg-gray-200'} hover:bg-[#4F46E5] hover:text-white hover:bg-opacity-80 transition-all`}
                      >
                        <PenTool size={20} />
                      </button>
                      <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 hidden group-hover:block">
                        <div className="p-2 grid grid-cols-6 gap-1">
                          {colorOptions.map(color => (
                            <button
                              key={color}
                              onClick={() => {
                                setSelectedTool('pen');
                                setPenColor(color);
                              }}
                              className="w-6 h-6 rounded-full border border-gray-200 hover:scale-110 transition-transform"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedTool('text')}
                      className={`p-2 rounded ${selectedTool === 'text' ? 'bg-[#4F46E5] text-white' : 'bg-gray-200'} hover:bg-[#4F46E5] hover:text-white hover:bg-opacity-80 transition-all`}
                    >
                      <Type size={20} />
                    </button>

                    <button
                      onClick={() => setSelectedTool('eraser')}
                      className={`p-2 rounded ${selectedTool === 'eraser' ? 'bg-[#4F46E5] text-white' : 'bg-gray-200'} hover:bg-[#4F46E5] hover:text-white hover:bg-opacity-80 transition-all`}
                    >
                      <Eraser size={20} />
                    </button>

                    <button
                      onClick={() => {
                        setSelectedTool('delete');
                        deleteSelected();
                      }}
                      className={`p-2 rounded ${selectedTool === 'delete' ? 'bg-[#4F46E5] text-white' : 'bg-gray-200'} hover:bg-[#4F46E5] hover:text-white hover:bg-opacity-80 transition-all`}
                    >
                      <Trash2 size={20} />
                    </button>

                    <button
                      onClick={clearCanvas}
                      className="p-2 rounded bg-gray-200 hover:bg-[#4F46E5] hover:text-white hover:bg-opacity-80 transition-all"
                    >
                      <RotateCcw size={20} />
                    </button>
                  </div>

                  <button
                    onClick={saveWhiteboardContent}
                    className="p-2 rounded bg-[#4F46E5] text-white hover:bg-opacity-80 transition-all flex items-center space-x-1"
                  >
                    <Save size={16} />
                    <span>Save</span>
                  </button>
                </div>

                <div className="rounded-lg overflow-hidden bg-white h-[420px]">
                  <canvas ref={canvasRef} className="w-full h-full" />
                </div>
              </div>
            )}

            {/* PDF Viewer */}
            {activeTab === 'pdf' && (
              <div className="p-4 rounded-lg bg-white shadow border border-gray-200 h-[500px]">
                {currentPdfUrl ? (
                  <>
                    <div className="flex justify-end mb-2">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded bg-gray-200 hover:bg-[#4F46E5] hover:text-white hover:bg-opacity-80 transition-all mr-2"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <span className="flex items-center text-gray-900 mr-2">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded bg-gray-200 hover:bg-[#4F46E5] hover:text-white hover:bg-opacity-80 transition-all"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                    <div className="rounded-lg overflow-hidden bg-gray-100 h-[450px] flex items-center justify-center">
                      <canvas ref={pdfCanvasRef} className="max-w-full max-h-full" />
                    </div>
                  </>
                ) : (
                  <div className="h-[500px] flex flex-col items-center justify-center text-gray-500">
                    <Upload size={48} className="mb-4" />
                    <p>Upload a PDF file to view</p>
                  </div>
                )}
              </div>
            )}

            {/* Notes */}
            {activeTab === 'notes' && (
              <div className="p-4 rounded-lg bg-white shadow border border-gray-200 h-[500px]">
                <div className="h-[450px]">
                  <input
                    type="text"
                    value={currentNote.title}
                    onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
                    placeholder="Note title..."
                    className="w-full p-2 rounded-md border bg-white border-gray-300 mb-2"
                  />
                  <div
                    ref={notesContentRef}
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => setCurrentNote({ ...currentNote, content: e.currentTarget.innerHTML })}
                    dangerouslySetInnerHTML={{ __html: currentNote.content }}
                    className="w-full h-[380px] p-2 rounded-md border bg-white border-gray-300 overflow-y-auto"
                    placeholder="Start typing your notes..."
                  />
                </div>
                <div className="flex justify-end mt-2 space-x-2">
                  <button
                    onClick={() => setCurrentNote({ 
                      id: '', 
                      title: '', 
                      content: '', 
                      timestamp: '',
                      isEditing: false 
                    })}
                    className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveNote}
                    className="px-4 py-2 rounded-md bg-[#4F46E5] text-white hover:bg-opacity-80 transition-all flex items-center space-x-1"
                  >
                    <Save size={16} />
                    <span>{currentNote.id ? 'Update' : 'Save'} Note</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar - Resources and Notes */}
          <div className="col-span-3 space-y-4">
            {/* Resources */}
            <div className="p-4 rounded-lg bg-white shadow border border-gray-200 h-[350px]">
              <h2 className="text-lg font-semibold mb-3">Resource</h2>
              <label className="block p-4 rounded-lg border-2 border-dashed border-gray-300 cursor-pointer mb-4">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                />
                <div className="flex flex-col items-center">
                  <Upload size={24} className="text-gray-500" />
                  <span className="mt-2 text-sm text-gray-500">Upload</span>
                </div>
              </label>
              <div className="space-y-2 h-48 overflow-y-auto">
                {resources.map((resource) => (
                  <div
                    key={resource.id}
                    className="p-2 rounded-md flex items-center justify-between bg-gray-100"
                  >
                    <div className="flex items-center space-x-2">
                      <FileText size={16} />
                      <span className="text-gray-800">{resource.name}</span>
                    </div>
                    <button
                      onClick={() => {
                        if (resource.type === 'pdf') {
                          setCurrentPdfUrl(resource.url);
                          setActiveTab('pdf');
                          loadPdf(resource.url);
                        }
                      }}
                      className="p-1 rounded bg-gray-300 hover:bg-[#4F46E5] hover:text-white hover:bg-opacity-80 transition-all"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Saved Notes */}
            <div className="p-4 rounded-lg bg-white shadow border border-gray-200 h-[500px]">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold">Saved Notes</h2>
                <button
                  onClick={createNewNote}
                  className="p-1 rounded bg-[#4F46E5] text-white hover:bg-opacity-80 transition-all"
                >
                  <Plus size={20} />
                </button>
              </div>
              
              <div className="relative mb-3">
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 pl-8 rounded-md border bg-white border-gray-300"
                />
                <Search size={16} className="absolute left-2 top-3 text-gray-400" />
              </div>
              
              <div className="space-y-2 h-[380px] overflow-y-auto">
                {filteredNotes.length > 0 ? (
                  filteredNotes.map((note) => (
                    <div
                      key={note.id}
                      className="p-3 rounded-md bg-gray-100 hover:bg-gray-200 transition-all"
                    >
                      <div className="flex justify-between items-start">
                        <h3 
                          className="font-medium cursor-pointer"
                          onClick={() => editNote(note)}
                        >
                          {note.title}
                        </h3>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => editNote(note)}
                            className="text-gray-500 hover:text-[#4F46E5] p-1 transition-all"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => deleteNote(note.id)}
                            className="text-gray-500 hover:text-red-500 p-1 transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <div 
                        className="text-sm mt-1 text-gray-600 line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: note.content }}
                      />
                      <div className="text-xs text-gray-500 mt-2">
                        {formatDate(note.timestamp)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    {searchTerm ? 'No matching notes found' : 'No notes yet. Create one!'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SoloStudy;