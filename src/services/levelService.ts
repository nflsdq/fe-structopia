import api from './api';
import { Level, Material, Quiz } from '../types';

const levelService = {
  /**
   * Get all levels
   */
  getLevels: async (): Promise<Level[]> => {
    const response = await api.get<{ data: Level[] }>('/levels');
    return response.data.data;
  },
  
  /**
   * Get a specific level
   */
  getLevel: async (id: number): Promise<Level> => {
    const response = await api.get<Level>(`/levels/${id}`);
    return response.data;
  },
  
  /**
   * Get materials for a specific level
   */
  getLevelMaterials: async (levelId: number, type?: string): Promise<Material[]> => {
    const query = type ? `?type=${type}` : '';
    const response = await api.get<{ data: Material[] }>(`/levels/${levelId}/materi${query}`);
    return response.data.data;
  },
  
  /**
   * Get quizzes for a specific level
   */
  // getLevelQuizzes: async (levelId: number): Promise<Quiz[]> => {
  //   const response = await api.get<{ data: Quiz[] }>(`/levels/${levelId}/quiz`);
  //   return response.data.data;
  // },
  
  /**
   * Get unlocked levels
   */
  // getUnlockedLevels: async (): Promise<Level[]> => {
  //   const response = await api.get<{ data: Level[] }>('/progress/unlocked-levels');
  //   return response.data.data;
  // },
};

export default levelService;