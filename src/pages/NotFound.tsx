import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, Home } from 'lucide-react';
import GameButton from '../components/common/GameButton';
import useAudio from '../hooks/useAudio';

const NotFound: React.FC = () => {
  const { playSound } = useAudio();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-lg"
      >
        <div className="mb-6">
          <motion.div 
            className="w-24 h-24 rounded-full bg-error-900/50 flex items-center justify-center mx-auto"
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 5, 0, -5, 0],
            }}
            transition={{ repeat: Infinity, duration: 5 }}
          >
            <AlertTriangle size={48} className="text-error-500" />
          </motion.div>
        </div>
        
        <h1 className="text-5xl font-display font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl font-display font-bold text-error-400 mb-6">Halaman Tidak Ditemukan</h2>
        
        <p className="text-neutral-300 mb-8">
          Sepertinya Anda tersesat dalam petualangan struktur data ini. Halaman yang Anda cari tidak ditemukan.
        </p>
        
        <Link to="/">
          <GameButton 
            variant="primary"
            size="lg"
            icon={<Home size={20} />}
            onClick={() => playSound('click')}
          >
            Kembali ke Beranda
          </GameButton>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;