import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Play, Award, BookOpen, ScrollText, Activity } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useGame } from '../../contexts/GameContext';
import { Level } from '../../types';
import useAudio from '../../hooks/useAudio';
import GameButton from '../../components/common/GameButton';
import levelService from '../../services/levelService';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { levels, loadLevels, userBadges, checkNewBadges, loadUserProgress } = useGame();
  const { playSound } = useAudio();
  const [featuredLevel, setFeaturedLevel] = useState<Level | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalCompletedMaterials, setTotalCompletedMaterials] = useState(0);
  const [isLoadingCompletedMaterials, setIsLoadingCompletedMaterials] = useState(true);
  
  useEffect(() => {
    const initDashboard = async () => {
      setLoading(true);
      setIsLoadingCompletedMaterials(true);
      await Promise.all([
        loadLevels(),
        loadUserProgress(),
        checkNewBadges(),
      ]);
      setLoading(false);
    };
    
    initDashboard();
  }, []);
  
  useEffect(() => {
    const calculateTotalCompletedMaterials = async () => {
      if (levels && levels.length > 0) {
        setIsLoadingCompletedMaterials(true);
        let count = 0;
        try {
          for (const level of levels) {
            if (level.status !== 'locked') {
              const materials = await levelService.getLevelMaterials(level.id);
              materials.forEach(material => {
                if (material.is_completed) {
                  count++;
                }
              });
            }
          }
          setTotalCompletedMaterials(count);
        } catch (error) {
          console.error("Error calculating total completed materials:", error);
          setTotalCompletedMaterials(0);
        } finally {
          setIsLoadingCompletedMaterials(false);
        }
      } else {
        setTotalCompletedMaterials(0);
        setIsLoadingCompletedMaterials(false);
      }
    };

    if (!loading) {
      calculateTotalCompletedMaterials();
    }
  }, [levels, loading]);
  
  // Set featured level (first ongoing level or first unlocked level)
  useEffect(() => {
    if (levels && levels.length > 0) {
      const ongoing = levels.find((level) => level.status === 'ongoing');
      const unlocked = levels.find((level) => level.status === 'unlocked');
      
      setFeaturedLevel(ongoing || unlocked || levels[0]);
    }
  }, [levels]);
  
  const getProgressPercentage = () => {
    if (!user) return 0;
    
    // XP calculation logic here
    // Mock calculation for demo
    const currentXp = user.xp || 0;
    const nextLevelXp = (user.current_level + 1) * 1000;
    const prevLevelXp = user.current_level * 1000;
    
    return Math.min(((currentXp - prevLevelXp) / (nextLevelXp - prevLevelXp)) * 100, 100);
  };
  
  // Calculate total unlocked levels
  const getUnlockedLevelsCount = () => {
    if (!levels) return 0;
    return levels.filter(level => level.status === 'unlocked' || level.status === 'ongoing').length;
  };
  
  const handlePlaySound = (soundName: 'click' | 'hover') => {
    playSound(soundName);
  };
  
  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-neutral-400">Memuat dashboard...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="pb-12">
      {/* Welcome header */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <div className="bg-gradient-to-r from-primary-900 to-secondary-900 rounded-2xl p-8 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-500 rounded-full opacity-10 transform translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary-500 rounded-full opacity-10 transform -translate-x-1/3 translate-y-1/3"></div>
          
          <div className="relative z-10">
            <h1 className="text-4xl font-display font-bold text-white mb-4">
              Selamat Datang, <span className="text-accent-400">{user.name}</span>!
            </h1>
            
            <p className="text-lg text-neutral-300 mb-6">
              Lanjutkan petualangan struktur data Anda. Anda saat ini di level {user.current_level}.
            </p>
            
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              {/* XP Progress Bar */}
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-neutral-300">XP: {user.xp}</span>
                  <span className="text-sm text-neutral-300">Level {user.current_level} → {+user.current_level + 1}</span>
                </div>
                <div className="xp-bar">
                  <div 
                    className="xp-bar-fill"
                    style={{ width: `${getProgressPercentage()}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Quick action */}
              {featuredLevel && (
                <div className="flex-shrink-0">
                  <Link to={`/levels/${featuredLevel.id}`}>
                    <GameButton 
                      variant="accent"
                      icon={<Play size={18} />}
                      onClick={() => handlePlaySound('click')}
                    >
                      {featuredLevel.status === 'ongoing' ? 'Lanjutkan Level' : 'Mulai Level'}
                    </GameButton>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.section>
      
      {/* Stats overview */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
      >
        <div className="game-card p-6 flex items-center">
          <div className="w-12 h-12 rounded-full bg-primary-900 flex items-center justify-center text-primary-400 mr-4">
            <ScrollText size={24} />
          </div>
          <div>
            <p className="text-sm text-neutral-400">Level Terbuka</p>
            <h3 className="text-xl font-display font-bold text-white">{getUnlockedLevelsCount()}</h3>
          </div>
        </div>
        
        <div className="game-card p-6 flex items-center">
          <div className="w-12 h-12 rounded-full bg-secondary-900 flex items-center justify-center text-secondary-400 mr-4">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-sm text-neutral-400">Materi Selesai</p>
            <h3 className="text-xl font-display font-bold text-white">
              {isLoadingCompletedMaterials ? 'Memuat...' : totalCompletedMaterials}
            </h3>
          </div>
        </div>
        
        <div className="game-card p-6 flex items-center">
          <div className="w-12 h-12 rounded-full bg-accent-900 flex items-center justify-center text-accent-400 mr-4">
            <Award size={24} />
          </div>
          <div>
            <p className="text-sm text-neutral-400">Badge Diperoleh</p>
            <h3 className="text-xl font-display font-bold text-white">{userBadges.length}</h3>
          </div>
        </div>
        
        <div className="game-card p-6 flex items-center">
          <div className="w-12 h-12 rounded-full bg-success-900 flex items-center justify-center text-success-400 mr-4">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm text-neutral-400">Total XP</p>
            <h3 className="text-xl font-display font-bold text-white">{user.xp}</h3>
          </div>
        </div>
      </motion.section>
      
      {/* Recent levels */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-10"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-display font-bold text-white">Level Terbaru</h2>
          <Link 
            to="/levels" 
            className="text-primary-400 hover:text-primary-300 flex items-center text-sm"
            onClick={() => handlePlaySound('click')}
          >
            Lihat Semua <ChevronRight size={16} />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {levels
            .filter(level => level.status !== 'locked')
            .slice(0, 3)
            .map((level, index) => (
              <motion.div
                key={level.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="game-card"
              >
                <div className="h-40 bg-gradient-to-br from-primary-800 to-neutral-900 relative flex items-center justify-center">
                  <div className="level-badge">{level.order}</div>
                  
                  {/* Level status indicator */}
                  <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
                    level.status === 'ongoing' 
                      ? 'bg-accent-500/20 text-accent-300 border border-accent-500/30' 
                      : 'bg-success-500/20 text-success-300 border border-success-500/30'
                  }`}>
                    {level.status === 'ongoing' ? 'Sedang Berlangsung' : 'Terbuka'}
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"></div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-display font-bold text-white mb-2">{level.name}</h3>
                  <p className="text-neutral-400 text-sm mb-4 line-clamp-2">{level.description}</p>
                  
                  <Link to={`/levels/${level.id}`}>
                    <GameButton 
                      variant={level.status === 'ongoing' ? 'accent' : 'primary'}
                      fullWidth
                      size="sm"
                      onClick={() => handlePlaySound('click')}
                    >
                      {level.status === 'ongoing' ? 'Lanjutkan' : 'Mulai'}
                    </GameButton>
                  </Link>
                </div>
              </motion.div>
            ))}
            
          {levels.filter(level => level.status !== 'locked').length === 0 && (
            <div className="col-span-3 text-center py-8">
              <p className="text-neutral-400">Belum ada level yang terbuka. Mulai petualangan Anda!</p>
            </div>
          )}
        </div>
      </motion.section>
      
      {/* Recent badges */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-display font-bold text-white">Badge Terbaru</h2>
          <Link 
            to="/profile" 
            className="text-primary-400 hover:text-primary-300 flex items-center text-sm"
            onClick={() => handlePlaySound('click')}
          >
            Lihat Semua <ChevronRight size={16} />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {userBadges.slice(0, 5).map((badge, index) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="game-card p-4 text-center"
            >
              <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center overflow-hidden">
                  {badge.icon ? (
                    <img src={badge.icon} alt={badge.name} className="w-full h-full object-cover" />
                  ) : (
                    // Fallback icon jika badge.icon tidak ada atau kosong
                    <Award className="text-accent-400" size={32} /> 
                  )}
                </div>
              </div>
              
              <h3 className="text-sm font-medium text-white mb-1">{badge.name}</h3>
              <p className="text-xs text-neutral-400 line-clamp-2">{badge.description}</p> 
            </motion.div>
          ))}
          
          {userBadges.length === 0 && (
            <div className="col-span-5 text-center py-8">
              <p className="text-neutral-400">Belum ada badge yang diperoleh. Selesaikan level untuk mendapatkan badge!</p>
            </div>
          )}
        </div>
      </motion.section>
    </div>
  );
};

export default Dashboard;