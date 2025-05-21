import api from './api';
import { LeaderboardEntry } from '../types';

const leaderboardService = {
  /**
   * Get leaderboard data
   */
  getLeaderboard: async (): Promise<LeaderboardEntry[]> => {
    // Menangani respons paginasi dari Laravel
    const response = await api.get<{ data: LeaderboardEntry[] }>('/leaderboard'); 
    return response.data.data; // Mengambil array dari field data
  },
};

export default leaderboardService; 