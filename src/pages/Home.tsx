import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTheme } from '../hooks/useTheme';
import Testimonials from '../components/Testimonials';
import AnimatedAvatar from '../components/AnimatedAvatar';
import { Check, Users, Video, MessageSquare, Bot, User, GraduationCap, Clock, Brain, ListTodo, X } from 'lucide-react';

function Home() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [showRoomSelection, setShowRoomSelection] = useState(false);
  const [featuresRef, featuresInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const features = {
    solo: [
      { icon: Clock, title: 'Pomodoro Timer', description: 'Stay focused with customizable study sessions' },
      { icon: Brain, title: 'Focus Tracking', description: 'Monitor and improve your study habits' },
      { icon: ListTodo, title: 'Task Management', description: 'Organize your study goals effectively' }
    ],
    group: [
      { icon: Video, title: 'Video Conferencing', description: 'Connect face-to-face with your study group' },
      { icon: Users, title: 'Group Creation', description: 'Create and manage study groups easily' },
      { icon: MessageSquare, title: 'Real-time Chat', description: 'Communicate seamlessly with your peers' },
      { icon: Bot, title: 'Shared Resources', description: 'Collaborate on study materials together' }
    ]
  };

  const handleGetStarted = () => {
    setShowRoomSelection(true);
  };

  const handleRoomSelection = (roomType) => {
    setShowRoomSelection(false);
    navigate(`/${roomType}-study`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Room Selection Modal */}
      {showRoomSelection && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className={`relative ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl p-8 max-w-md w-full shadow-2xl`}
          >
            <button 
              onClick={() => setShowRoomSelection(false)}
              className={`absolute top-4 right-4 p-1 rounded-full ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              <X className={`w-6 h-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
            </button>
            
            <h3 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Choose Your Study Mode
            </h3>
            
            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleRoomSelection('solo')}
                className={`w-full p-6 rounded-lg text-left ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-indigo-50 hover:bg-indigo-100'} transition-colors`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-indigo-600' : 'bg-indigo-500'}`}>
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Solo Study</h4>
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Focus on your own with productivity tools</p>
                  </div>
                </div>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleRoomSelection('group')}
                className={`w-full p-6 rounded-lg text-left ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-indigo-50 hover:bg-indigo-100'} transition-colors`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-indigo-600' : 'bg-indigo-500'}`}>
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Group Study</h4>
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Collaborate with peers in real-time</p>
                  </div>
                </div>
              </motion.button>
            </div>
            
            <div className="mt-6 text-center">
              <button 
                onClick={() => navigate('/signin')}
                className={`text-sm ${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'} font-medium`}
              >
                Not registered yet? Sign up first
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Hero Section */}
      <div className="min-h-[80vh] flex items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`text-5xl md:text-7xl font-bold leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}
            >
              Join Study Space
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className={`text-xl md:text-2xl mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
            >
              The #1 Platform where Students can collaborate virtually 24/7
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGetStarted}
                className="px-8 py-4 bg-indigo-600 text-white rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                Get Started
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const element = document.getElementById('features-section');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`px-8 py-4 rounded-lg text-lg font-semibold border-2 ${
                  isDark 
                    ? 'border-gray-700 text-gray-300 hover:bg-gray-800' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                } transition-colors`}
              >
                Learn More
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right side - Animated illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hidden md:flex justify-center items-center"
          >
            <AnimatedAvatar />
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features-section" ref={featuresRef} className="py-24">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={featuresInView ? { opacity: 1 } : {}}
          className={`text-3xl md:text-4xl font-bold text-center mb-16 ${isDark ? 'text-white' : 'text-gray-900'}`}
        >
          Why Choose Study Space?
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Solo Study Mode */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            className={`relative overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'} p-8 rounded-xl shadow-xl h-full`}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 20px 20px, ${isDark ? '#4F46E5' : '#818CF8'} 2%, transparent 0%), 
                                 radial-gradient(circle at 20px 20px, ${isDark ? '#4F46E5' : '#818CF8'} 2%, transparent 0%)`,
                backgroundSize: '40px 40px',
                backgroundPosition: '0 0, 20px 20px'
              }}/>
            </div>

            <Link to="/solo-study" className="block h-full relative z-10">
              <h3 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Solo Study Room
              </h3>

              {/* Solo Study Feature Layout */}
              <div className="grid grid-cols-3 gap-8 mb-12">
                {features.solo.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="flex flex-col items-center text-center"
                  >
                    <div className={`w-20 h-20 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-indigo-50'} flex items-center justify-center mb-4`}>
                      <feature.icon className={`w-10 h-10 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
                    </div>
                    <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {feature.title}
                    </h4>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>

              <div className="space-y-4">
                {features.solo.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                      {feature.description}
                    </span>
                  </div>
                ))}
              </div>
            </Link>
          </motion.div>

          {/* Group Study Mode */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-8 rounded-xl shadow-xl h-full`}
          >
            <Link to="/group-study" className="block h-full">
              <h3 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Group Study Rooms
              </h3>

              {/* Group Study Animation */}
              <motion.div className="relative h-64 mb-8">
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                >
                  {/* Central hub */}
                  <motion.div
                    className={`w-24 h-24 rounded-full ${isDark ? 'bg-indigo-600' : 'bg-indigo-500'} flex items-center justify-center z-10`}
                    whileHover={{ scale: 1.1 }}
                  >
                    <Users className="w-12 h-12 text-white" />
                  </motion.div>

                  {/* Connected nodes */}
                  {[0, 1, 2, 3].map((index) => (
                    <React.Fragment key={index}>
                      <motion.div
                        className={`absolute w-14 h-14 rounded-full ${isDark ? 'bg-gray-700' : 'bg-white'} shadow-lg flex items-center justify-center`}
                        style={{
                          top: `${50 + 40 * Math.sin(2 * Math.PI * index / 4)}%`,
                          left: `${50 + 40 * Math.cos(2 * Math.PI * index / 4)}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                        whileHover={{ scale: 1.2 }}
                      >
                        <User className={`w-7 h-7 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
                      </motion.div>
                      <motion.div
                        className={`absolute h-px ${isDark ? 'bg-indigo-400' : 'bg-indigo-600'}`}
                        style={{
                          width: '80px',
                          top: '50%',
                          left: '50%',
                          transform: `rotate(${90 * index}deg)`,
                          transformOrigin: '0 0'
                        }}
                      />
                    </React.Fragment>
                  ))}
                </motion.div>
              </motion.div>

              <div className="space-y-4">
                {features.group.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                      {feature.description}
                    </span>
                  </div>
                ))}
              </div>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Testimonials Section */}
      <Testimonials />
    </div>
  );
}

export default Home;