import React, { useState, useRef, useEffect } from 'react';
import { Monitor, StopCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';

interface ScreenShareProps {
  onScreenShare?: (stream: MediaStream) => void;
}

function ScreenShare({ onScreenShare }: ScreenShareProps) {
  const { isDark } = useTheme();
  const [isSharing, setIsSharing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startScreenShare = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: "always"
        },
        audio: false
      });

      setStream(mediaStream);
      setIsSharing(true);
      if (onScreenShare) {
        onScreenShare(mediaStream);
      }

      // Handle stream ending (user clicks "Stop Sharing")
      mediaStream.getVideoTracks()[0].addEventListener('ended', () => {
        stopScreenShare();
      });
    } catch (error) {
      console.error('Error sharing screen:', error);
    }
  };

  const stopScreenShare = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsSharing(false);
  };

  return (
    <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Screen Sharing
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={isSharing ? stopScreenShare : startScreenShare}
          className={`px-4 py-2 rounded-md flex items-center space-x-2 ${
            isSharing
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          {isSharing ? (
            <>
              <StopCircle className="h-5 w-5" />
              <span>Stop Sharing</span>
            </>
          ) : (
            <>
              <Monitor className="h-5 w-5" />
              <span>Share Screen</span>
            </>
          )}
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Local Preview */}
        <div className={`aspect-video rounded-lg overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <AnimatePresence>
            {isSharing ? (
              <motion.video
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full flex items-center justify-center"
              >
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Your Screen (Preview)
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Simulated Other User's View */}
        <div className={`aspect-video rounded-lg overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <AnimatePresence>
            {isSharing ? (
              <motion.video
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full flex items-center justify-center"
              >
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Other User's View (Demo)
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default ScreenShare;