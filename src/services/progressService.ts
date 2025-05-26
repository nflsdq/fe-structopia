import api from './api';
import { Progress, Level } from '../types';

const progressService = {
  /**
   * Get user progress
   */
  getProgress: async (): Promise<Progress[]> => {
    const response = await api.get<{ data: any[] }>('/progress');
    // Map level_id (snake_case) ke levelId (camelCase) agar konsisten dengan type Progress
    return response.data.data.map(p => ({ ...p, levelId: p.level_id ?? p.levelId }));
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