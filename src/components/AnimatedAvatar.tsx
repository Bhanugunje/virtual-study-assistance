import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Book, Brain, Users } from 'lucide-react';

function AnimatedAvatar() {
  const iconVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: (i: number) => ({
      scale: 1,
      rotate: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.8,
        repeat: Infinity,
        repeatType: "reverse",
        repeatDelay: 2
      }
    })
  };

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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

  const icons = [Bot, Book, Brain, Users];

  return (
    <motion.div
      className="relative w-96 h-96"
      initial="initial"
      animate="animate"
      variants={containerVariants}
    >
      {/* Central circle */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Bot className="w-12 h-12 text-white" />
      </motion.div>

      {/* Orbiting icons */}
      <motion.div
        className="absolute inset-0"
        variants={orbitVariants}
        animate="animate"
      >
        {icons.map((Icon, i) => (
          <motion.div
            key={i}
            className="absolute w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center"
            style={{
              top: `${50 + 35 * Math.sin(2 * Math.PI * i / icons.length)}%`,
              left: `${50 + 35 * Math.cos(2 * Math.PI * i / icons.length)}%`,
              transform: 'translate(-50%, -50%)'
            }}
            variants={iconVariants}
            custom={i}
          >
            <Icon className="w-8 h-8 text-indigo-600" />
          </motion.div>
        ))}
      </motion.div>

      {/* Decorative rings */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-64 h-64 border-2 border-indigo-200 rounded-full"
        style={{ transform: 'translate(-50%, -50%)' }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 w-80 h-80 border-2 border-indigo-100 rounded-full"
        style={{ transform: 'translate(-50%, -50%)' }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.5 }}
        transition={{ duration: 1, delay: 0.2 }}
      />
    </motion.div>
  );
}

export default AnimatedAvatar;