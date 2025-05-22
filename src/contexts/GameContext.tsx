import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Level, Badge, Progress } from '../types';
import levelService from '../services/levelService';
import progressService from '../services/progressService';
import badgeService from '../services/badgeService';
import useAudio from '../hooks/useAudio';
import { toast } from 'react-toastify';

interface GameContextType {
  levels: Level[];
  badges: Badge[];
  userBadges: Badge[];
  userProgress: Progress[];
  loadLevels: () => Promise<void>;
  loadBadges: () => Promise<void>;
  loadUserProgress: () => Promise<void>;
  checkNewBadges: () => Promise<void>;
  isLoading: boolean;
  addXP: (amount: number) => void;
  currentQuest: string | null;
  setCurrentQuest: (quest: string | null) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [levels, setLevels] = useState<Level[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [userBadges, setUserBadges] = useState<Badge[]>([]);
  const [userProgress, setUserProgress] = useState<Progress[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentQuest, setCurrentQuest] = useState<string | null>(null);
  
  const { user, refreshUser, isAuthenticated } = useAuth();
  const { playSound } = useAudio();
  
  useEffect(() => {
    if (isAuthenticated) {
      loadGameData();
    }
  }, [isAuthenticated]);
  
  const loadGameData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        loadLevels(),
        loadBadges(),
        loadUserProgress(),
      ]);
    } catch (error) {
      console.error('Failed to load game data', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const loadLevels = async (): Promise<void> => {
    try {
      const levelsData = await levelService.getLevels();
      setLevels(levelsData);
    } catch (error) {
      console.error('Failed to load levels', error);
    }
  };
  
  const loadBadges = async (): Promise<void> => {
    try {
      const [allBadgesData, userBadgesDataResult] = await Promise.all([
        badgeService.getAllBadges(),
        badgeService.getUserBadges(),
      ]);
      
      setBadges(allBadgesData);
      setUserBadges(userBadgesDataResult);
    } catch (error) {
      console.error('Failed to load badges', error);
    }
  };
  
  const loadUserProgress = async (): Promise<void> => {
    try {
      const progressData = await progressService.getProgress();
      setUserProgress(progressData);
    } catch (error) {
      console.error('Failed to load user progress', error);
    }
  };
  
  const checkNewBadges = async (): Promise<void> => {
    try {
      await badgeService.checkAutomaticBadges();
      await loadBadges();
    } catch (error) {
      console.error('Failed to check for new badges', error);
    }
  };
  
  const addXP = async (amount: number): Promise<void> => {
    if (!user) return;
    
    try {
      await refreshUser();
      playSound('xp');
      
      toast.success(`Anda mendapatkan ${amount} XP!`);
    
      await checkNewBadges();
    } catch (error) {
      console.error('Failed to add XP', error);
    }
  };
  
  return (
    <GameContext.Provider
      value={{
        levels,
        badges,
        userBadges,
        userProgress,
        loadLevels,
        loadBadges,
        loadUserProgress,
        checkNewBadges,
        isLoading,
        addXP,
        currentQuest,
        setCurrentQuest,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};