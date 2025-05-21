import api from './api';
import { AuthResponse, LoginCredentials, RegisterCredentials, User } from '../types';

const authService = {
  /**
   * Register a new user
   */
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/register', credentials);
    
    // Store token and user data in local storage
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    return response.data;
  },
  
  /**
   * Login an existing user
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/login', credentials);
    
    // Store token and user data in local storage
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    return response.data;
  },
  
  /**
   * Logout the current user
   */
  logout: async (): Promise<void> => {
    try {
      await api.post('/logout');
    } finally {
      // Always clear local storage, even if the API call fails
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },
  
  /**
   * Get the current user info
   */
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/user');
    
    // Update stored user data
    localStorage.setItem('user', JSON.stringify(response.data));
    
    return response.data;
  },
  
  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },
  
  /**
   * Get user from local storage
   */
  getStoredUser: (): User | null => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

export default authService;