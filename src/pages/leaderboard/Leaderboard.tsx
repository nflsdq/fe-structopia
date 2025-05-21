import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Crown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import leaderboardService from '../../services/leaderboardService';
import { LeaderboardEntry } from '../../types';

const Leaderboard: React.FC = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userRank, setUserRank] = useState<number | null>(null);
  
  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      try {
        const data = await leaderboardService.getLeaderboard();
        setLeaderboard(data);
        
        // Find user's rank
        if (user) {
          const rank = data.findIndex(entry => entry.id === user.id) + 1;
          setUserRank(rank > 0 ? rank : null);
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLeaderboard();
  }, [user]);
  
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown size={24} className="text-warning-400" />;
      case 2:
        return <Medal size={24} className="text-secondary-400" />;
      case 3:
        return <Award size={24} className="text-accent-400" />;
      default:
        return <Trophy size={24} className="text-neutral-400" />;
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-neutral-400">Memuat leaderboard...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="pb-12">
      {/* Header */}
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
          
          <div className="relative z-10">
            <h1 className="text-4xl font-display font-bold text-white mb-4">Leaderboard</h1>
            <p className="text-lg text-neutral-300">
              Bersaing dengan siswa lain dan raih posisi teratas!
            </p>
            
            {userRank && (
              <div className="mt-6 inline-flex items-center bg-neutral-800/50 px-6 py-3 rounded-lg">
                <Trophy size={20} className="text-primary-400 mr-3" />
                <span className="text-white">Peringkat Anda: #{userRank}</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
      
      {/* Leaderboard list */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="space-y-4"
      >
        {leaderboard.map((entry, index) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`game-card p-4 ${
              user && entry.id === user.id ? 'border-2 border-primary-500' : ''
            }`}
          >
            <div className="flex items-center">
              {/* Rank */}
              <div className="w-16 flex items-center justify-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  index < 3 ? 'bg-warning-900/20' : 'bg-neutral-800'
                }`}>
                  {getRankIcon(index + 1)}
                </div>
              </div>
              
              {/* User info */}
              <div className="flex-1 flex items-center">
                <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center mr-4">
                  {entry.avatarUrl ? (
                    <img 
                      src={entry.avatarUrl} 
                      alt={entry.name} 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-lg font-bold text-primary-400">
                      {entry.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                
                <div>
                  <h3 className="font-medium text-white">{entry.name}</h3>
                  <p className="text-sm text-neutral-400">Level {entry.level}</p>
                </div>
              </div>
              
              {/* XP */}
              <div className="text-right">
                <div className="text-lg font-display font-bold text-accent-400">
                  {entry.xp} XP
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        
        {leaderboard.length === 0 && (
          <div className="text-center py-12">
            <Trophy size={48} className="mx-auto mb-4 text-neutral-500" />
            <p className="text-neutral-400">
              Belum ada data leaderboard. Jadilah yang pertama!
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Leaderboard;