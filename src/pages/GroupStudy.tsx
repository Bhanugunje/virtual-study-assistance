import React, { useState, useEffect, useRef } from 'react';
import { 
  Settings, 
  LogOut, 
  Users, 
  Clock, 
  MessageSquare, 
  FileUp,
  Play,
  Pause,
  Plus,
  Circle,
  Edit3,
  Send,
  User,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Square,
  Type,
  Eraser,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  Expand,
  Minimize
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';
import ScreenShare from '../components/ScreenShare';

interface GroupMember {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  focusScore: number;
}

interface GroupTask {
  id: string;
  title: string;
  assignedTo: string;
  completed: boolean;
}

interface SharedResource {
  id: string;
  name: string;
  type: string;
  uploadedBy: string;
  uploadedAt: string;
}

interface Message {
  id: string;
  userId: string;
  userName: string;
  avatar: string;
  content: string;
  timestamp: string;
}

interface WhiteboardTool {
  type: 'pen' | 'marker' | 'eraser';
  size: number;
  color?: string;
}

function GroupStudy() {
  const { isDark } = useTheme();
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [groupMembers] = useState<GroupMember[]>([
    { id: '1', name: 'John Doe', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', isOnline: true, focusScore: 85 },
    { id: '2', name: 'Jane Smith', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', isOnline: true, focusScore: 92 },
    { id: '3', name: 'Mike Johnson', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', isOnline: false, focusScore: 78 }
  ]);

  const [tasks, setTasks] = useState<GroupTask[]>([
    { id: '1', title: 'Review Chapter 5', assignedTo: '1', completed: false },
    { id: '2', title: 'Prepare Study Notes', assignedTo: '2', completed: true },
    { id: '3', title: 'Practice Problems', assignedTo: '3', completed: false }
  ]);

  const [resources] = useState<SharedResource[]>([
    { id: '1', name: 'Study Guide.pdf', type: 'pdf', uploadedBy: 'John Doe', uploadedAt: '2024-03-15 10:30' },
    { id: '2', name: 'Practice Questions.docx', type: 'doc', uploadedBy: 'Jane Smith', uploadedAt: '2024-03-15 11:15' }
  ]);

  const [messages, setMessages] = useState<Message[]>([
    { id: '1', userId: '1', userName: 'John Doe', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', content: 'Shall we start with Chapter 5?', timestamp: '10:30 AM' },
    { id: '2', userId: '2', userName: 'Jane Smith', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', content: 'Yes, I have my notes ready', timestamp: '10:32 AM' }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [newTask, setNewTask] = useState('');
  const [selectedTool, setSelectedTool] = useState<WhiteboardTool>({ type: 'pen', size: 2, color: '#000000' });
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [isWhiteboardFullscreen, setIsWhiteboardFullscreen] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Calculate task completion progress
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Initialize whiteboard
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Clear canvas
    ctx.fillStyle = isDark ? '#374151' : '#f3f4f6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isDark]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Whiteboard drawing functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e as React.MouseEvent).clientX ? 
      (e as React.MouseEvent).clientX - rect.left : 
      (e as React.TouchEvent).touches[0].clientX - rect.left;
    const y = (e as React.MouseEvent).clientY ? 
      (e as React.MouseEvent).clientY - rect.top : 
      (e as React.TouchEvent).touches[0].clientY - rect.top;

    setIsDrawing(true);
    setLastPoint({ x, y });
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const currentX = (e as React.MouseEvent).clientX ? 
      (e as React.MouseEvent).clientX - rect.left : 
      (e as React.TouchEvent).touches[0].clientX - rect.left;
    const currentY = (e as React.MouseEvent).clientY ? 
      (e as React.MouseEvent).clientY - rect.top : 
      (e as React.TouchEvent).touches[0].clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(currentX, currentY);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    if (selectedTool.type === 'eraser') {
      ctx.strokeStyle = isDark ? '#374151' : '#f3f4f6';
    } else {
      ctx.strokeStyle = selectedTool.color || '#000000';
    }
    
    ctx.lineWidth = selectedTool.size;
    ctx.stroke();

    setLastPoint({ x: currentX, y: currentY });
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearWhiteboard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = isDark ? '#374151' : '#f3f4f6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    
    const task: GroupTask = {
      id: Date.now().toString(),
      title: newTask,
      assignedTo: groupMembers[0].id, // Default to first member
      completed: false
    };
    
    setTasks([...tasks, task]);
    setNewTask('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Handle file upload logic here
    console.log('File selected:', e.target.files?.[0]);
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const newMsg: Message = {
      id: Date.now().toString(),
      userId: '1', // Assuming current user is John Doe for demo
      userName: 'John Doe',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  const toggleChatExpand = () => {
    setIsChatExpanded(!isChatExpanded);
  };

  const toggleWhiteboardFullscreen = () => {
    setIsWhiteboardFullscreen(!isWhiteboardFullscreen);
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Top Navigation */}
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} p-4`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Study Group</h1>
            <span className={`px-2 py-1 rounded-full text-sm ${isDark ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'}`}>
              Active
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsVideoEnabled(!isVideoEnabled)}
              className={`p-2 rounded-full ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              {isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setIsAudioEnabled(!isAudioEnabled)}
              className={`p-2 rounded-full ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              {isAudioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </button>
            <button className={`p-2 rounded-full ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
              <Settings className="h-5 w-5" />
            </button>
            <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center space-x-2">
              <LogOut className="h-4 w-4" />
              <span>Leave Room</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel - Group Members & Tasks */}
          <div className={`lg:col-span-3 space-y-6 ${isWhiteboardFullscreen ? 'hidden' : ''}`}>
            {/* Group Members */}
            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
              <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Group Members
              </h2>
              <div className="space-y-4">
                {groupMembers.map(member => (
                  <div key={member.id} className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                        member.isOnline ? 'bg-green-400' : 'bg-gray-400'
                      }`} />
                    </div>
                    <div>
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {member.name}
                      </p>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Focus Score: {member.focusScore}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Group Tasks */}
            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Group Tasks
                </h2>
                <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {completedTasks}/{totalTasks} completed
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="mb-4">
                <div className={`w-full h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div 
                    className="h-2 rounded-full bg-indigo-600 transition-all duration-300" 
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Progress
                  </span>
                  <span className={`text-xs font-medium ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
                    {progressPercentage}%
                  </span>
                </div>
              </div>
              
              <form onSubmit={addTask} className="mb-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Add new task..."
                    className={`flex-1 px-3 py-2 rounded-md ${
                      isDark 
                        ? 'bg-gray-700 text-white placeholder-gray-400' 
                        : 'bg-gray-50 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                  <button
                    type="submit"
                    className="p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </form>
              <div className="space-y-2">
                {tasks.map(task => (
                  <div
                    key={task.id}
                    className={`flex items-center justify-between p-2 rounded-md ${
                      isDark ? 'bg-gray-700' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className={`p-1 rounded-full ${
                          task.completed
                            ? 'bg-green-500 text-white'
                            : isDark
                            ? 'bg-gray-600'
                            : 'bg-gray-200'
                        }`}
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <span className={`${
                        task.completed ? 'line-through text-gray-500' : isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {task.title}
                      </span>
                    </div>
                    <button
                      onClick={() => setTasks(tasks.filter(t => t.id !== task.id))}
                      className="text-red-500 hover:text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center Panel */}
          <div className={`lg:col-span-6 space-y-6 ${isChatExpanded ? 'hidden' : 'block'} ${isWhiteboardFullscreen ? 'lg:col-span-12' : ''}`}>
            {/* Screen Share */}
            {!isWhiteboardFullscreen && <ScreenShare />}

            {/* Whiteboard */}
            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Whiteboard
                </h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedTool({ type: 'pen', size: 2 })}
                    className={`p-2 rounded-md ${
                      selectedTool.type === 'pen' ? 'bg-indigo-600 text-white' : isDark ? 'bg-gray-700' : 'bg-gray-100'
                    }`}
                  >
                    <Edit3 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setSelectedTool({ type: 'marker', size: 5 })}
                    className={`p-2 rounded-md ${
                      selectedTool.type === 'marker' ? 'bg-indigo-600 text-white' : isDark ? 'bg-gray-700' : 'bg-gray-100'
                    }`}
                  >
                    <Type className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setSelectedTool({ type: 'eraser', size: 20 })}
                    className={`p-2 rounded-md ${
                      selectedTool.type === 'eraser' ? 'bg-indigo-600 text-white' : isDark ? 'bg-gray-700' : 'bg-gray-100'
                    }`}
                  >
                    <Eraser className="h-5 w-5" />
                  </button>
                  {selectedTool.type !== 'eraser' && (
                    <input
                      type="color"
                      value={selectedTool.color}
                      onChange={(e) => setSelectedTool({ ...selectedTool, color: e.target.value })}
                      className="w-8 h-8 rounded-md cursor-pointer"
                    />
                  )}
                  <button
                    onClick={clearWhiteboard}
                    className={`p-2 rounded-md ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                  >
                    <Square className="h-5 w-5" />
                  </button>
                  <button
                    onClick={toggleWhiteboardFullscreen}
                    className={`p-2 rounded-md ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                  >
                    {isWhiteboardFullscreen ? <Minimize className="h-5 w-5" /> : <Expand className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <div className={`aspect-video rounded-lg overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <canvas
                  ref={canvasRef}
                  className="w-full h-full cursor-crosshair"
                  style={{ touchAction: 'none' }}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
              </div>
            </div>
          </div>

          {/* Right Panel - Chat & Resources */}
          <div className={`lg:col-span-3 ${isChatExpanded ? 'lg:col-span-9' : ''} ${isWhiteboardFullscreen ? 'hidden' : ''} space-y-6`}>
            {/* Group Chat */}
            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 flex flex-col ${isChatExpanded ? 'h-[calc(100vh-12rem)]' : 'h-[calc(100vh-24rem)]'}`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Group Chat
                </h2>
                <button
                  onClick={toggleChatExpand}
                  className={`p-2 rounded-md ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  {isChatExpanded ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                </button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.map(message => (
                  <div key={message.id} className="flex items-start space-x-3">
                    <img
                      src={message.avatar}
                      alt={message.userName}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <div className="flex items-baseline space-x-2">
                        <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {message.userName}
                        </span>
                        <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {message.timestamp}
                        </span>
                      </div>
                      <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                        {message.content}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <form onSubmit={sendMessage} className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className={`flex-1 px-3 py-2 rounded-md ${
                    isDark 
                      ? 'bg-gray-700 text-white placeholder-gray-400' 
                      : 'bg-gray-50 text-gray-900 placeholder-gray-500'
                  }`}
                />
                <button
                  type="submit"
                  className="p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  <Send className="h-5 w-5" />
                </button>
              </form>
            </div>

            {/* Shared Resources - Hide when chat is expanded */}
            {!isChatExpanded && (
              <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
                <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Shared Resources
                </h2>
                <div className="space-y-4">
                  <label className={`block p-4 rounded-lg border-2 border-dashed ${
                    isDark ? 'border-gray-600 hover:border-gray-500' : 'border-gray-300 hover:border-gray-400'
                  } cursor-pointer`}>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <div className="flex flex-col items-center">
                      <FileUp className={`h-8 w-8 mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Click to upload or drag and drop
                      </p>
                    </div>
                  </label>
                  {resources.map(resource => (
                    <div
                      key={resource.id}
                      className={`p-3 rounded-md ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {resource.name}
                        </span>
                        <button className="text-indigo-600 hover:text-indigo-700">
                          <ChevronDown className="h-4 w-4" />
                        </button>
                      </div>
                      <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Uploaded by {resource.uploadedBy}
                      </div>
                      <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {resource.uploadedAt}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroupStudy;
