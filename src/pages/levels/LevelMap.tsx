import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, CheckCircle, Play, AlertCircle } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';
import { Level } from '../../types';
import useAudio from '../../hooks/useAudio';
import GameButton from '../../components/common/GameButton';
import testService from '../../services/testService';
import progressService from '../../services/progressService';

const LevelMap: React.FC = () => {
  const { levels, loadLevels, isLoading } = useGame();
  const { playSound } = useAudio();
  const [levelMap, setLevelMap] = useState<Level[]>([]);
  const [sudahPretest, setSudahPretest] = useState(false);
  const [sudahPosttest, setSudahPosttest] = useState(false);
  const [canDoPosttest, setCanDoPosttest] = useState(false);
  
  useEffect(() => {
    const initLevels = async () => {
      await loadLevels();
    };
    
    initLevels();
  }, []);
  
  useEffect(() => {
    if (levels && levels.length > 0) {
      // Sort levels by order
      const sortedLevels = [...levels].sort((a, b) => a.order - b.order);
      setLevelMap(sortedLevels);
    }
  }, [levels]);
  
  useEffect(() => {
    const cekPretest = async () => {
      try {
        const history = await testService.getHistory();
        setSudahPretest(history.some(h => h.type === 'pretest'));
        setSudahPosttest(history.some(h => h.type === 'posttest'));
      } catch {}
    };
    cekPretest();
  }, []);
  
  useEffect(() => {
    const cekPosttest = async () => {
      try {
        const progress = await progressService.getProgress();
        const lastProgress = progress.find(p => p.level_id === 5 && p.status === 'completed');
        setCanDoPosttest(!!lastProgress);
      } catch {
        setCanDoPosttest(false);
      }
    };
    cekPosttest();
  }, []);
  
  const handleLevelClick = (level: Level) => {
    if (level.status === 'locked') {
      playSound('error');
    } else {
      playSound('click');
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'unlocked':
        return <Play size={20} className="text-primary-300" />;
      case 'ongoing':
        return <Play size={20} className="text-accent-400" />;
      case 'locked':
        return <Lock size={20} className="text-neutral-500" />;
      default:
        return <CheckCircle size={20} className="text-success-400" />;
    }
  };
  
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'unlocked':
        return 'border-primary-500 bg-primary-900/50';
      case 'ongoing':
        return 'border-accent-500 bg-accent-900/50';
      case 'locked':
        return 'border-neutral-700 bg-neutral-800/50 opacity-60';
      default:
        return 'border-success-500 bg-success-900/50';
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-neutral-400">Memuat peta level...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="pb-12">
      <header className="mb-10">
        <h1 className="text-4xl font-display font-bold text-white mb-4">Peta Petualangan</h1>
        <p className="text-lg text-neutral-300">
          Jelajahi level-level struktur data dalam petualangan ini. Selesaikan satu per satu untuk membuka level selanjutnya.
        </p>
      </header>
      
      {/* Pretest Card */}
      {!sudahPretest && (
        <div className="max-w-xl mx-auto mb-8">
          <div className="game-card border-2 border-primary-500 bg-primary-900/50 p-6 flex flex-col items-center">
            <h2 className="text-2xl font-display font-bold text-white mb-2">Pretest</h2>
            <p className="text-neutral-300 mb-4 text-center">Kerjakan pretest untuk mengukur kemampuan awalmu sebelum memulai petualangan level.</p>
            <Link to="/test/pretest">
              <GameButton variant="primary" onClick={() => playSound('click')}>Mulai Pretest</GameButton>
            </Link>
          </div>
        </div>
      )}
      
      {/* Level Map Grid */}
      <div className="relative my-8 md:my-16">
        {/* Path lines connecting levels */}
        <div className="absolute top-0 bottom-0 w-1 bg-neutral-700 z-0 left-4 right-4 mx-auto md:left-1/2 md:-translate-x-1/2 md:right-auto"></div>
        
        {levelMap.map((level, index) => {
          // Alternate levels left and right
          const isLeft = index % 2 === 0;
          
          return (
            <React.Fragment key={level.id}>
              {/* Level Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative z-10 flex flex-col md:flex-row md:justify-center"
                style={{ marginTop: index === 0 ? 0 : '80px' }}
              >
                <div className={`w-12 h-12 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border-4 ${
                  level.status !== 'locked' ? 'border-accent-500 bg-accent-900' : 'border-neutral-700 bg-neutral-800'
                }`}>
                  <div className="absolute inset-0 flex items-center justify-center font-display font-bold text-lg">
                    {level.order}
                  </div>
                </div>
                
                {/* Card positioned to the left or right */}
                <div
                  className={`max-w-xs w-full md:w-80 ${isLeft ? 'md:mr-auto' : 'md:ml-auto'} mx-auto`}
                  style={window.innerWidth >= 768 ? { marginLeft: isLeft ? 'calc(50% - 400px)' : 'calc(50% + 80px)' } : {}}
                >
                  <Link 
                    to={level.status !== 'locked' ? `/levels/${level.id}` : '#'}
                    onClick={() => handleLevelClick(level)}
                    className={`block game-card border-2 ${getStatusClass(level.status)} ${
                      level.status === 'locked' ? 'cursor-not-allowed' : 'hover:transform hover:-translate-y-2'
                    }`}
                  >
                    <div className="p-4 md:p-6">
                      <div className="flex justify-between items-center mb-3">
                        <span className="level-badge">{level.order}</span>
                        <div className="flex items-center">
                          {getStatusIcon(level.status)}
                          <span className={`ml-2 text-sm font-medium ${
                            level.status === 'locked' ? 'text-neutral-500' : 
                            level.status === 'ongoing' ? 'text-accent-400' : 
                            level.status === 'unlocked' ? 'text-primary-300' : 'text-success-400'
                          }`}>
                            {level.status === 'locked' ? 'Terkunci' : 
                             level.status === 'ongoing' ? 'Sedang Berlangsung' : 
                             level.status === 'unlocked' ? 'Tersedia' : 'Selesai'}
                          </span>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-display font-bold text-white mb-2">{level.name}</h3>
                      <p className="text-neutral-400 text-sm mb-4">{level.description}</p>
                      
                      {level.status === 'locked' && (
                        <div className="bg-neutral-800 rounded-lg p-3 flex items-center">
                          <AlertCircle size={16} className="text-neutral-500 mr-2 flex-shrink-0" />
                          <span className="text-xs text-neutral-500">
                            {level.keterangan || 'Selesaikan level sebelumnya untuk membuka level ini.'}
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                </div>
              </motion.div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Posttest Card */}
      {!sudahPosttest && (
        <div className="max-w-xl mx-auto mt-12">
          <div className="game-card border-2 border-accent-500 bg-accent-900/50 p-6 flex flex-col items-center">
            <h2 className="text-2xl font-display font-bold text-white mb-2">Posttest</h2>
            <p className="text-neutral-300 mb-4 text-center">Kerjakan posttest untuk mengukur peningkatan kemampuanmu setelah menyelesaikan semua level.</p>
            <Link to={canDoPosttest ? "/test/posttest" : "#"} tabIndex={canDoPosttest ? 0 : -1}>
              <GameButton variant="accent" onClick={() => canDoPosttest && playSound('click')} disabled={!canDoPosttest}>
                Mulai Posttest
              </GameButton>
            </Link>
            {!canDoPosttest && (
              <div className="text-sm text-error-400 mt-2 text-center">Selesaikan semua level terlebih dahulu untuk membuka posttest.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LevelMap;