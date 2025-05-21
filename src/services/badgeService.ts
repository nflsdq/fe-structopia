import api from './api';
import { Badge, CheckBadgesResponse } from '../types';

const badgeService = {
  /**
   * Get all badges
   */
  getAllBadges: async (): Promise<Badge[]> => {
    // Menangani respons paginasi dari Laravel
    const response = await api.get<{ data: Badge[] }>('/badges'); 
    return response.data.data; // Mengambil array dari field data
  },
  
  /**
   * Get user badges
   */
  getUserBadges: async (): Promise<Badge[]> => {
    // Menangani respons paginasi dari Laravel
    const response = await api.get<{ data: Badge[] }>('/user/badges'); 
    return response.data.data; // Mengambil array dari field data
  },
  
  /**
   * Trigger check for new automatic badges
   */
  checkAutomaticBadges: async (): Promise<CheckBadgesResponse> => {
    const response = await api.post<CheckBadgesResponse>('/user/badges/check-automatic');
    return response.data;
  },
};

export default badgeService; 