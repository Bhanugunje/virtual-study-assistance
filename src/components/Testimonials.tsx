import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Alex Chen",
    role: "Computer Science Student",
    content: "Study Space has transformed my learning experience. The AI-powered tools and focused environment help me stay productive even during long study sessions.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    name: "Sarah Williams",
    role: "Medical Student",
    content: "The collaborative features are amazing! Being able to study with peers globally has made my preparation for medical exams much more effective.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    name: "Marcus Johnson",
    role: "Engineering Student",
    content: "The pomodoro timer and AI study assistant have significantly improved my study habits. It's like having a personal study coach available 24/7.",
    rating: 4,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    name: "Emma Davis",
    role: "Law Student",
    content: "Group study rooms are perfect for mock trials and case discussions. The platform's features make remote collaboration feel natural and engaging.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  }
];

function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { isDark } = useTheme();

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
          >
            What Students Say
          </motion.h2>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mt-2 h-1 w-24 bg-[#4F46E5] mx-auto rounded-full"
          />
        </div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className={`max-w-3xl mx-auto ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-8`}
            >
              <div className="flex items-center space-x-6 mb-8">
                <motion.img
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  src={testimonials[currentIndex].image}
                  alt={testimonials[currentIndex].name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-[#4F46E5]"
                />
                <div>
                  <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {testimonials[currentIndex].name}
                  </h3>
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {testimonials[currentIndex].role}
                  </p>
                  <div className="flex items-center mt-2">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                </div>
              </div>

              <p className={`text-lg mb-8 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {testimonials[currentIndex].content}
              </p>

              <div className="flex justify-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={prevTestimonial}
                  className={`p-2 rounded-full ${
                    isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <ChevronLeft className={`h-6 w-6 ${isDark ? 'text-white' : 'text-gray-700'}`} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={nextTestimonial}
                  className={`p-2 rounded-full ${
                    isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <ChevronRight className={`h-6 w-6 ${isDark ? 'text-white' : 'text-gray-700'}`} />
                </motion.button>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex
                      ? 'bg-[#4F46E5]'
                      : isDark
                      ? 'bg-gray-600'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Testimonials;