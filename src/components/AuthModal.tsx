import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import SignIn from '../pages/SignIn';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function AuthModal({ isOpen, onClose }: AuthModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-4xl">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-50 p-2 rounded-full bg-gray-100 hover:bg-gray-200"
              >
                <X className="h-5 w-5 text-gray-700" />
              </button>
              <SignIn onSuccess={onClose} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default AuthModal;