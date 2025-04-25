import React, { createContext, useContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import SignIn from './pages/SignIn';
import SoloStudy from './pages/SoloStudy';
import GroupStudy from './pages/GroupStudy';
import BackToTop from './components/BackToTop';
import ChatAssistant from './components/ChatAssistant';
import { AuthProvider } from './context/AuthContext';

export const ThemeContext = createContext({
  isDark: false,
  toggleTheme: () => {},
});

function App() {
  const [isDark, setIsDark] = useState(false);
  const toggleTheme = () => setIsDark(!isDark);

  return (
    <AuthProvider>
      <ThemeContext.Provider value={{ isDark, toggleTheme }}>
        <Router>
          <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/solo-study" element={<SoloStudy />} />
              <Route path="/group-study" element={<GroupStudy />} />
            </Routes>
            <BackToTop />
            <ChatAssistant />
          </div>
        </Router>
      </ThemeContext.Provider>
    </AuthProvider>
  );
}

export default App;