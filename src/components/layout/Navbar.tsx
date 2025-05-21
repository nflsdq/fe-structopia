import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { Menu, Volume2, VolumeX, User, LogOut } from 'lucide-react';
import useAudio from '../../hooks/useAudio';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const { isMuted, toggleMute, playSound } = useAudio();
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.user-menu') && !target.closest('.user-menu-trigger')) {
        setShowUserMenu(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  
  const handleLogout = async () => {
    await logout();
  };
  
  const handleToggleMute = () => {
    toggleMute();
    playSound('click');
  };
  
  const handleUserMenuToggle = () => {
    setShowUserMenu(!showUserMenu);
    playSound('click');
  };
  
  return (
    <header className="z-20 bg-neutral-900 border-b border-neutral-800 shadow-lg relative">
      <div className="container mx-auto px-0 md:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo and mobile menu button */}
          <div className="flex items-center">
            <button 
              className="lg:hidden mr-2 p-2 rounded-full hover:bg-neutral-800 text-primary-400"
              onClick={toggleSidebar}
            >
              <Menu size={24} />
            </button>
            
            <Link 
              to="/dashboard" 
              className="flex items-center space-x-2"
              onClick={() => playSound('click')}
            >
              <motion.div
                className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center"
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg width="24" height="24" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <radialGradient id="bg" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stop-color="#6D28D9"/>
                      <stop offset="100%" stop-color="#4C1D95"/>
                    </radialGradient>
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="3" result="blur"/>
                      <feMerge>
                        <feMergeNode in="blur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>

                  <rect width="100" height="100" rx="20" fill="url(#bg)"/               >

                  <circle cx="50" cy="28" r="8" fill="#F97316" filter="url(#glow)"/>
                  <circle cx="30" cy="55" r="6" fill="#ffffff" filter="url(#glow)"/>
                  <circle cx="70" cy="55" r="6" fill="#ffffff" filter="url(#glow)"/>
                  <line x1="50" y1="28" x2="30" y2="55" stroke="#fff" stroke-width="3" stroke-linecap="round" />
                  <line x1="50" y1="28" x2="70" y2="55" stroke="#fff" stroke-width="3" stroke-linecap="round" /               >

                  <rect x="48" y="65" width="4" height="4" fill="#FACC15"/>
                  <rect x="46" y="69" width="8" height="2" fill="#FACC15"/>
                  <rect x="47" y="72" width="6" height="2" fill="#FACC15"/                >

                  <text x="50%" y="92" text-anchor="middle" fill="#fff" font-size="12" font-family="Poppins" font-weight="600">XP</text>
                </svg>
              </motion.div>
              
              <div className="font-display text-white text-xl hidden sm:block">
                STRUCTOPIA
              </div>
            </Link>
          </div>
          
          {/* Right side - User profile and sound control */}
          <div className="flex items-center space-x-4">
            {/* Sound toggle */}
            <button 
              className="p-2 rounded-full hover:bg-neutral-800 text-primary-300 hover:text-primary-400"
              onClick={handleToggleMute}
              title={isMuted ? "Aktifkan Suara" : "Matikan Suara"}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            
            {/* User profile */}
            {user && (
              <div className="relative">
                <button 
                  className="p-2 rounded-full hover:bg-neutral-800 text-primary-300 hover:text-primary-400 flex items-center space-x-2 user-menu-trigger"
                  onClick={handleUserMenuToggle}
                >
                  <span className="hidden md:block text-sm font-medium">{user.name}</span>
                  <span className="flex items-center justify-center rounded-full w-8 h-8 bg-primary-500 text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </button>
                
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-neutral-800 border border-primary-600 overflow-hidden user-menu"
                    >
                      <div className="p-3 border-b border-neutral-700">
                        <p className="text-white font-medium">{user.name}</p>
                        <p className="text-neutral-400 text-sm">{user.email}</p>
                      </div>
                      
                      <div className="py-1">
                        <Link 
                          to="/profile" 
                          className="flex items-center px-4 py-2 text-sm text-neutral-300 hover:bg-primary-900 hover:text-white"
                          onClick={() => playSound('click')}
                        >
                          <User size={16} className="mr-2" />
                          Profil Saya
                        </Link>
                        
                        <button 
                          className="w-full text-left flex items-center px-4 py-2 text-sm text-error-300 hover:bg-error-900 hover:text-error-200"
                          onClick={handleLogout}
                        >
                          <LogOut size={16} className="mr-2" />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Decorative edge */}
      <div className="h-1 w-full bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-500"></div>
    </header>
  );
};

export default Navbar;