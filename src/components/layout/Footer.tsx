import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-900 border-t border-neutral-800 py-6">
      <div className="container mx-auto px-0 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="100" height="100" rx="20" fill="#6D28D9" />
                  <path d="M30 25H70V75H30V25Z" stroke="white" strokeWidth="5" />
                  <path d="M40 40H60V60H40V40Z" fill="#F97316" />
                  <path d="M45 50H75" stroke="white" strokeWidth="5" />
                  <path d="M25 50H35" stroke="white" strokeWidth="5" />
                  <path d="M50 35V25" stroke="white" strokeWidth="5" />
                  <path d="M50 75V65" stroke="white" strokeWidth="5" />
                </svg>
              </div>
              <span className="font-display text-white text-lg">STRUCTOPIA</span>
            </Link>
            <p className="text-neutral-500 text-sm mt-2">
              Platform pembelajaran struktur data berbasis gamifikasi
            </p>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center">
          <div className="text-neutral-500 text-sm mb-4 md:mb-0">
            &copy; 2025 Structopia. All rights reserved.
          </div>
          
          <div className="flex space-x-4 text-sm">
            <Link to="#" className="text-neutral-400 hover:text-primary-400 transition-colors">
              Syarat & Ketentuan
            </Link>
            <Link to="#" className="text-neutral-400 hover:text-primary-400 transition-colors">
              Kebijakan Privasi
            </Link>
            <Link to="#" className="text-neutral-400 hover:text-primary-400 transition-colors">
              Bantuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;