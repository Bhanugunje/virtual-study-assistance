import React from 'react';
import { motion } from 'framer-motion';
import { User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function UserProfile() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative group"
    >
      <button className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
          ) : (
            <User className="h-5 w-5 text-white" />
          )}
        </div>
        <span className="hidden md:block">{user.name}</span>
      </button>

      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
        <div className="p-4 border-b">
          <p className="font-semibold">{user.name}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
        {user.bio && (
          <div className="p-4 border-b">
            <p className="text-sm font-medium text-gray-700">Bio</p>
            <p className="text-sm text-gray-500">{user.bio}</p>
          </div>
        )}
        {user.education && (
          <div className="p-4 border-b">
            <p className="text-sm font-medium text-gray-700">Education</p>
            <p className="text-sm text-gray-500">{user.education}</p>
          </div>
        )}
        <button
          onClick={logout}
          className="w-full p-4 text-left text-sm text-red-600 hover:bg-gray-50 flex items-center space-x-2"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </motion.div>
  );
}

export default UserProfile;