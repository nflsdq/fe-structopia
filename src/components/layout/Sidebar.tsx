import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Home, Map, Trophy, User } from 'lucide-react';
import useAudio from '../../hooks/useAudio';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

interface MenuItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const { playSound } = useAudio();
  
  const menuItems: MenuItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: <Home size={20} /> },
    { label: 'Peta Petualangan', path: '/levels', icon: <Map size={20} /> },
    { label: 'Leaderboard', path: '/leaderboard', icon: <Trophy size={20} /> },
    { label: 'Profil', path: '/profile', icon: <User size={20} /> },
  ];
  
  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25,
      },
    },
    closed: {
      x: '-100%',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25,
      },
    },
  };
  
  const overlayVariants = {
    open: {
      opacity: 1,
      display: 'block',
    },
    closed: {
      opacity: 0,
      transitionEnd: {
        display: 'none',
      },
    },
  };
  
  const handleLinkClick = () => {
    playSound('click');
    if (window.innerWidth < 1024) {
      toggleSidebar();
    }
  };
  
  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>
      
      {/* Sidebar for mobile (hidden on desktop) */}
      <motion.div
        variants={sidebarVariants}
        initial="closed"
        animate={isOpen ? 'open' : 'closed'}
        className="fixed top-0 left-0 h-full w-64 bg-neutral-900 border-r border-neutral-800 shadow-xl z-20 lg:hidden"
      >
        <div className="flex justify-between items-center h-16 px-4 border-b border-neutral-800">
          <h2 className="font-display text-xl text-white">STRUCTOPIA</h2>
          <button 
            className="p-2 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white"
            onClick={toggleSidebar}
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="mt-6 px-4">
          {menuItems.map((item) => (
            <Link
              key={item.path + '-' + item.label}
              to={item.path}
              className={`
                flex items-center space-x-3 px-4 py-3 mb-2 rounded-lg text-sm font-medium
                transition-all duration-200
                ${location.pathname === item.path 
                  ? 'bg-primary-900 text-primary-300 border-l-4 border-primary-500' 
                  : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'}
              `}
              onClick={handleLinkClick}
            >
              <span className={location.pathname === item.path ? 'text-primary-400' : ''}>{item.icon}</span>
              <span>{item.label}</span>
              
              {location.pathname === item.path && (
                <motion.div
                  layoutId="sidebar-indicator-mobile"
                  className="absolute right-0 w-1 h-8 bg-primary-500 rounded-l"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </Link>
          ))}
        </nav>
      </motion.div>
      
      {/* Sidebar for desktop (hidden on mobile) */}
      <div className="hidden lg:block h-full w-64 bg-neutral-900 border-r border-neutral-800 shadow-xl">
        <nav className="mt-6 px-4">
          {menuItems.map((item) => (
            <Link
              key={item.path + '-' + item.label}
              to={item.path}
              className={`
                relative flex items-center space-x-3 px-4 py-3 mb-2 rounded-lg text-sm font-medium
                transition-all duration-200
                ${location.pathname === item.path 
                  ? 'bg-primary-900 text-primary-300 border-l-4 border-primary-500' 
                  : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'}
              `}
              onClick={handleLinkClick}
            >
              <span className={location.pathname === item.path ? 'text-primary-400' : ''}>{item.icon}</span>
              <span>{item.label}</span>
              
              {location.pathname === item.path && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="absolute right-0 w-1 h-8 bg-primary-500 rounded-l"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;