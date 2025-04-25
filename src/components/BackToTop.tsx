import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';

function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const { isDark } = useTheme();

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={scrollToTop}
          className={`fixed bottom-8 right-8 p-3 rounded-full shadow-lg ${
            isDark ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-white hover:bg-gray-100'
          }`}
        >
          <ArrowUp className={`h-6 w-6 ${isDark ? 'text-white' : 'text-indigo-600'}`} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

export default BackToTop;