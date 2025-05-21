import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const LoadingScreen: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Memuat Game World...');
  
  const loadingTexts = [
    'Membangun Dunia Struktur Data...',
    'Mengumpulkan Kristal Algoritma...',
    'Memanggil NPC Pembelajaran...',
    'Membuka Portal Pengetahuan...',
    'Menghidupkan Karakter Game...',
    'Mempersiapkan Quest Utama...',
    'Menyusun Peta Petualangan...'
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = Math.min(prev + Math.random() * 15, 100);
        if (newProgress === 100) {
          clearInterval(interval);
        }
        return newProgress;
      });
      
      setLoadingText(loadingTexts[Math.floor(Math.random() * loadingTexts.length)]);
    }, 500);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="fixed inset-0 bg-neutral-900 flex flex-col items-center justify-center z-50">
      <div className="w-full max-w-md px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-display text-primary-400 mb-2">
            STRUCTOPIA
          </h1>
          <p className="text-accent-400 text-lg">Petualangan Struktur Data</p>
        </motion.div>
        
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          className="h-4 bg-primary-500 rounded-full relative overflow-hidden mb-2"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-primary-400 to-primary-600 opacity-70 animate-pulse-slow"></div>
        </motion.div>
        
        <div className="flex justify-between text-sm text-primary-300">
          <span>{progress.toFixed(0)}%</span>
          <motion.span
            key={loadingText}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {loadingText}
          </motion.span>
        </div>
        
        <motion.div 
          className="mt-12 flex justify-center"
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 5, 0, -5, 0]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 2
          }}
        >
          <div className="flex space-x-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-4 h-4 bg-accent-400 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingScreen;