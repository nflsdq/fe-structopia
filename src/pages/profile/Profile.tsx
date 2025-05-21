import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Star, Trophy, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useGame } from '../../contexts/GameContext';
import leaderboardService from '../../services/leaderboardService';
// import { Badge } from '../../types';
// import GameButton from '../../components/common/GameButton';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { userBadges, loadBadges } = useGame();
  const [isLoading, setIsLoading] = useState(true);
  const [userRank, setUserRank] = useState<number | null>(null);
  
  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      try {
        await loadBadges();
        // Ambil leaderboard dan cari peringkat user
        if (user) {
          const leaderboard = await leaderboardService.getLeaderboard();
          const rank = leaderboard.findIndex(entry => entry.id === user.id) + 1;
          setUserRank(rank > 0 ? rank : null);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserData();
  }, [user]);
  
  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-neutral-400">Memuat profil...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="pb-12">
      {/* Profile header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <div className="bg-gradient-to-r from-primary-900 to-accent-900 rounded-2xl p-8 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500 rounded-full opacity-10 transform translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-accent-500 rounded-full opacity-10 transform -translate-x-1/3 translate-y-1/3"></div>
          
          <div className="relative z-10 flex items-center">
            <div className="w-24 h-24 rounded-full bg-neutral-800 flex items-center justify-center mr-6 border-4 border-primary-500">
              {user.avatarUrl ? (
                <img 
                  src={user.avatarUrl} 
                  alt={user.name} 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User size={48} className="text-primary-400" />
              )}
            </div>
            
            <div>
              <h1 className="text-4xl font-display font-bold text-white mb-2">{user.name}</h1>
              <p className="text-lg text-neutral-300">Level {user.current_level} • {user.xp} XP</p>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Stats overview */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
      >
        <div className="game-card p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-primary-900 flex items-center justify-center text-primary-400 mr-4">
              <Trophy size={24} />
            </div>
            <div>
              <p className="text-sm text-neutral-400">Peringkat</p>
              <h3 className="text-xl font-display font-bold text-white">
                {userRank ? `#${userRank}` : '-'}
              </h3>
            </div>
          </div>
        </div>
        
        <div className="game-card p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-accent-900 flex items-center justify-center text-accent-400 mr-4">
              <Award size={24} />
            </div>
            <div>
              <p className="text-sm text-neutral-400">Badge Diperoleh</p>
              <h3 className="text-xl font-display font-bold text-white">{userBadges.length}</h3>
            </div>
          </div>
        </div>
        
        <div className="game-card p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-success-900 flex items-center justify-center text-success-400 mr-4">
              <Star size={24} />
            </div>
            <div>
              <p className="text-sm text-neutral-400">Level Selesai</p>
              <h3 className="text-xl font-display font-bold text-white">3</h3>
            </div>
          </div>
        </div>
      </motion.section>
      
      {/* Badges section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-2xl font-display font-bold text-white mb-6">Badge Koleksi</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {userBadges.map((badge, index) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="game-card p-6 text-center"
            >
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 p-1">
                <div className="w-full h-full rounded-full bg-neutral-800 flex items-center justify-center overflow-hidden">
                  {badge.icon ? (
                    <img src={badge.icon} alt={badge.name} className="w-full h-full object-cover" />
                  ) : (
                    <Award className="text-accent-400" size={36} />
                  )}
                </div>
              </div>
              
              <h3 className="text-lg font-display font-bold text-white mb-1">{badge.name}</h3>
              <p className="text-sm text-neutral-400 mb-3 line-clamp-3">{badge.description}</p>
              
              {/* {typeof badge.xpReward === 'number' && badge.xpReward > 0 && (
                <div className="text-xs text-accent-400">
                  +{badge.xpReward} XP
                </div>
              )} */}
            </motion.div>
          ))}
          
          {userBadges.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Award size={48} className="mx-auto mb-4 text-neutral-500" />
              <p className="text-neutral-400">
                Belum ada badge yang diperoleh. Selesaikan level untuk mendapatkan badge!
              </p>
            </div>
          )}
        </div>
      </motion.section>
    </div>
  );
};

export default Profile;