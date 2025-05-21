import api from './api';
import { Progress, Level } from '../types';

const progressService = {
  /**
   * Get user progress
   */
  getProgress: async (): Promise<Progress[]> => {
    const response = await api.get<{ data: Progress[] }>('/progress');
    return response.data.data;
  },
  
  /**
   * Update progress for a level
   */
  updateProgress: async (levelId: number, status: 'completed' | 'in-progress'): Promise<Progress> => {
    const response = await api.post<Progress>('/progress/update', {
      level_id: levelId,
      status,
    });
    return response.data;
  },
  
  /**
   * Get unlocked levels (dipindahkan dari levelService)
   */
  getUnlockedLevels: async (): Promise<Level[]> => {
    const response = await api.get<Level[]>('/progress/unlocked-levels');
    return response.data;
  },
};

export default progressService;