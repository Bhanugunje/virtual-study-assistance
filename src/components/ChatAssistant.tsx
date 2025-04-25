import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Maximize2, Minimize2, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

function ChatAssistant() {
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Initialize Gemini AI
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyBAsneNjurlnb72RiJeLvXyJ0a68xTfG44');
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash"});

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      if (!import.meta.env.VITE_GEMINI_API_KEY) {
        throw new Error('API key not found');
      }

      const result = await model.generateContent(userMessage);
      const response = await result.response;
      const text = response.text();

      setMessages(prev => [...prev, { role: 'assistant', content: text }]);
    } catch (error) {
      console.error('Error generating response:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please make sure the API key is configured correctly and try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`${
              isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } border rounded-lg shadow-lg w-[300px] h-[500px] flex flex-col`}
          >
            {/* Chat Header */}
            <div className={`${
              isDark ? 'bg-gray-900' : 'bg-gray-50'
            } p-4 rounded-t-lg flex items-center justify-between border-b ${
              isDark ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="flex items-center space-x-2">
                <Bot className={`h-6 w-6 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
                <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Study Assistant
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsMinimized(true)}
                  className={`p-1 rounded-full hover:bg-gray-200 ${isDark ? 'hover:bg-gray-700' : ''}`}
                >
                  <Minimize2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className={`p-1 rounded-full hover:bg-gray-200 ${isDark ? 'hover:bg-gray-700' : ''}`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4"
            >
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`relative max-w-[80%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? `${isDark ? 'bg-indigo-600' : 'bg-indigo-500'} text-white`
                        : isDark
                        ? 'bg-gray-700 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {message.content}
                    {message.role === 'assistant' && (
                      <button
                        onClick={() => copyToClipboard(message.content, index)}
                        className={`absolute -top-2 -right-2 p-1 rounded-full ${
                          isDark ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                        title="Copy to clipboard"
                      >
                        {copiedIndex === index ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className={`max-w-[80%] rounded-lg p-3 ${
                    isDark ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSend} className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything..."
                  className={`flex-1 p-2 rounded-md border ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 placeholder-gray-500'
                  }`}
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`p-2 rounded-md ${
                    isDark ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600'
                  } text-white`}
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimized Chat */}
      <AnimatePresence>
        {isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`${
              isDark ? 'bg-gray-800' : 'bg-white'
            } p-4 rounded-lg shadow-lg flex items-center justify-between w-[300px]`}
          >
            <div className="flex items-center space-x-2">
              <Bot className={`h-6 w-6 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
              <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Study Assistant
              </span>
            </div>
            <button
              onClick={() => setIsMinimized(false)}
              className={`p-1 rounded-full hover:bg-gray-200 ${isDark ? 'hover:bg-gray-700' : ''}`}
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Button */}
      {!isOpen && !isMinimized && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className={`${
            isDark ? 'bg-gray-800' : 'bg-white'
          } p-4 rounded-full shadow-lg`}
        >
          <Bot className={`h-6 w-6 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
        </motion.button>
      )}
    </div>
  );
}

export default ChatAssistant;