import api from './api';
import { Material, CompleteMaterialResponse } from '../types';

const materialService = {
  /**
   * Get a specific material
   */
  getMaterial: async (id: number): Promise<Material> => {
    const response = await api.get<Material>(`/materi/${id}`);
    return response.data;
  },
  
  /**
   * Mark a material as completed
   */
  completeMaterial: async (id: number): Promise<CompleteMaterialResponse> => {
    const response = await api.post<CompleteMaterialResponse>(`/materi/${id}/complete`);
    return response.data;
  },
};

export default materialService;