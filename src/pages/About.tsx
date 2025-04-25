import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';
import { Check, Users, Video, MessageSquare, Bot, Brain, Clock, ListTodo, BookOpen, PenTool, Target, Lightbulb } from 'lucide-react';

function About() {
  const { isDark } = useTheme();

  const features = {
    solo: [
      { icon: Clock, title: 'Pomodoro Timer', description: 'Stay focused with customizable study sessions' },
      { icon: Bot, title: 'AI Study Assistant', description: 'Get instant help with your questions' },
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const orbitVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 20,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const floatVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} py-16`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Why Choose Study Space?
          </h1>
          <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto`}>
            Empowering students with innovative tools and collaborative features for effective learning
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
          {/* Solo Study Mode */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.02 }}
            className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-8 rounded-xl shadow-xl`}
          >
            <div className="flex flex-col h-full">
              <h2 className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Solo Study Mode
              </h2>

              {/* Solo Study Animation */}
              <motion.div className="relative h-64 mb-8">
                <motion.div
                  variants={orbitVariants}
                  animate="animate"
                  className="absolute inset-0 flex items-center justify-center"
                >
                  {/* Central circle */}
                  <motion.div
                    className={`w-20 h-20 rounded-full ${isDark ? 'bg-indigo-600' : 'bg-indigo-500'} flex items-center justify-center`}
                    variants={floatVariants}
                    animate="animate"
                  >
                    <BookOpen className="w-10 h-10 text-white" />
                  </motion.div>

                  {/* Orbiting elements */}
                  {[Brain, Target, PenTool, Lightbulb].map((Icon, index) => (
                    <motion.div
                      key={index}
                      className={`absolute w-12 h-12 rounded-full ${isDark ? 'bg-gray-700' : 'bg-white'} shadow-lg flex items-center justify-center`}
                      style={{
                        top: `${50 + 35 * Math.sin(2 * Math.PI * index / 4)}%`,
                        left: `${50 + 35 * Math.cos(2 * Math.PI * index / 4)}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      <Icon className={`w-6 h-6 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              <div className="space-y-6">
                {features.solo.map((feature, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="flex items-start space-x-4"
                  >
                    <div className={`p-2 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-indigo-50'}`}>
                      <feature.icon className={`h-6 w-6 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
                    </div>
                    <div>
                      <h3 className={`text-lg font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {feature.title}
                      </h3>
                      <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                        {feature.description}
                      </p>
                    </div>
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Group Study Mode */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.02 }}
            className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-8 rounded-xl shadow-xl`}
          >
            <div className="flex flex-col h-full">
              <h2 className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Group Study Mode
              </h2>

              {/* Group Study Animation */}
              <motion.div className="relative h-64 mb-8">
                <motion.div
                  variants={floatVariants}
                  animate="animate"
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

              <div className="space-y-6">
                {features.group.map((feature, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="flex items-start space-x-4"
                  >
                    <div className={`p-2 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-indigo-50'}`}>
                      <feature.icon className={`h-6 w-6 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
                    </div>
                    <div>
                      <h3 className={`text-lg font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {feature.title}
                      </h3>
                      <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                        {feature.description}
                      </p>
                    </div>
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default About;