import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Bot, Sun, Moon, Menu, X, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link as ScrollLink } from 'react-scroll';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../context/AuthContext';
import UserProfile from './UserProfile';
import AuthModal from './AuthModal';

function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const { isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  const menuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleStudyRoomClick = (path: string) => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
    } else {
      navigate(path);
    }
  };

  const handleLearnMore = () => {
    if (isHome) {
      const element = document.getElementById('about-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/about');
    }
  };

  return (
    <>
      <nav className={`${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm transition-colors duration-300 sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-4">
              {!isHome && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleBack}
                  className={`p-2 rounded-full ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  <ArrowLeft className={`h-5 w-5 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
                </motion.button>
              )}
              <Link to="/" className="flex items-center space-x-2">
                <Bot className={`h-8 w-8 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
                <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Study Space
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className={isDark ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-700 hover:text-indigo-600'}>
                Home
              </Link>
              
              <Link to="/about" className={isDark ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-700 hover:text-indigo-600'}>
                About
              </Link>

              <button
                onClick={() => handleStudyRoomClick('/solo-study')}
                className={isDark ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-700 hover:text-indigo-600'}
              >
                Solo Study
              </button>

              <button
                onClick={() => handleStudyRoomClick('/group-study')}
                className={isDark ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-700 hover:text-indigo-600'}
              >
                Group Study
              </button>

              {!isAuthenticated ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setIsAuthModalOpen(true)}
                  className={`px-4 py-2 rounded-md ${
                    isDark 
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  Sign In
                </motion.button>
              ) : (
                <UserProfile />
              )}

              <motion.button
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className={`p-2 rounded-full ${
                  isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                {isDark ? (
                  <Sun className="h-5 w-5 text-gray-300" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-600" />
                )}
              </motion.button>
            </div>

            {/* Mobile Navigation Toggle */}
            <div className="flex items-center space-x-4 md:hidden">
              {isAuthenticated && <UserProfile />}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className={`p-2 rounded-full ${
                  isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                {isDark ? (
                  <Sun className="h-5 w-5 text-gray-300" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-600" />
                )}
              </motion.button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 rounded-full ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                {isMenuOpen ? (
                  <X className={`h-6 w-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
                ) : (
                  <Menu className={`h-6 w-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                variants={menuVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="md:hidden"
              >
                <div className={`px-2 pt-2 pb-3 space-y-1 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                  <Link
                    to="/"
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    to="/about"
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    About
                  </Link>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleStudyRoomClick('/solo-study');
                    }}
                    className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                      isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Solo Study
                  </button>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleStudyRoomClick('/group-study');
                    }}
                    className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                      isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Group Study
                  </button>
                  {!isAuthenticated && (
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsAuthModalOpen(true);
                      }}
                      className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                        isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Sign In
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
}

export default Navbar;