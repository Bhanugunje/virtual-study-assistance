import React, { useState } from 'react';
import { Mail, Lock, Github, Linkedin, Facebook, User, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface SignInProps {
  onSuccess?: () => void;
}

function SignIn({ onSuccess }: SignInProps) {
  const { isDark } = useTheme();
  const { login } = useAuth();
  const [isSignIn, setIsSignIn] = useState(true);
  const navigate = useNavigate();

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const handleBack = () => {
    navigate(-1);
  };

  const toggleMode = () => {
    setIsSignIn(!isSignIn);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login for demonstration
    login({
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      bio: 'Computer Science Student',
      education: 'University of Technology',
    });
    if (onSuccess) {
      onSuccess();
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <button
          onClick={handleBack}
          className="absolute top-4 left-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200"
        >
          <ArrowLeft className="h-5 w-5 text-gray-700" />
        </button>

        <div className="flex flex-col md:flex-row min-h-[600px]">
          <AnimatePresence initial={false} custom={isSignIn ? 1 : -1}>
            <motion.div
              key={isSignIn ? "signin-welcome" : "signup-welcome"}
              className="w-full md:w-1/2 bg-[#4F46E5] p-8 text-white flex items-center justify-center"
              custom={!isSignIn ? 1 : -1}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
            >
              <div className="text-center">
                <h3 className="text-3xl font-bold mb-4">
                  {isSignIn ? 'Hello, Friend!' : 'Welcome Back!'}
                </h3>
                <p className="mb-8">
                  Enter your personal details to use all of site features
                </p>
                <button
                  onClick={toggleMode}
                  className="px-6 py-2 border-2 border-white rounded-lg hover:bg-white hover:text-[#4F46E5] transition-colors"
                >
                  {isSignIn ? 'SIGN UP' : 'SIGN IN'}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence initial={false} custom={isSignIn ? 1 : -1}>
            <motion.div
              key={isSignIn ? "signin-form" : "signup-form"}
              className="w-full md:w-1/2 p-8 bg-white"
              custom={isSignIn ? 1 : -1}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
            >
              <div className="mt-8">
                <h2 className="text-3xl font-bold mb-6 text-gray-900">
                  {isSignIn ? 'Sign In' : 'Create Account'}
                </h2>
                <div className="flex space-x-4 mb-6 justify-center">
                  <button className="p-3 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors">
                    <svg className="h-5 w-5 text-gray-700" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1Z" />
                    </svg>
                  </button>
                  <button className="p-3 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors">
                    <Facebook className="h-5 w-5 text-gray-700" />
                  </button>
                  <button className="p-3 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors">
                    <Github className="h-5 w-5 text-gray-700" />
                  </button>
                  <button className="p-3 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors">
                    <Linkedin className="h-5 w-5 text-gray-700" />
                  </button>
                </div>
                <p className="text-sm text-center mb-6 text-gray-500">
                  or use your email {isSignIn ? 'to sign in' : 'for registration'}
                </p>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  {!isSignIn && (
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full px-3 py-2 rounded-lg bg-gray-100 border-transparent focus:border-[#4F46E5] focus:bg-white focus:ring-0 transition-colors"
                        placeholder="Name"
                      />
                    </div>
                  )}
                  <div className="relative">
                    <input
                      type="email"
                      className="w-full px-3 py-2 rounded-lg bg-gray-100 border-transparent focus:border-[#4F46E5] focus:bg-white focus:ring-0 transition-colors"
                      placeholder="Email"
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      className="w-full px-3 py-2 rounded-lg bg-gray-100 border-transparent focus:border-[#4F46E5] focus:bg-white focus:ring-0 transition-colors"
                      placeholder="Password"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 px-4 rounded-lg text-white bg-[#4F46E5] hover:bg-[#4338CA] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4F46E5]"
                  >
                    {isSignIn ? 'SIGN IN' : 'SIGN UP'}
                  </button>
                </form>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default SignIn;