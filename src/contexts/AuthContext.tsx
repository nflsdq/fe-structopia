import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { User, LoginCredentials, RegisterCredentials } from '../types';
import authService from '../services/authService';
import useAudio from '../hooks/useAudio';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(authService.getStoredUser());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { playSound } = useAudio();
  
  const isAuthenticated = !!user;
  
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      if (authService.isAuthenticated()) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error('Failed to get user data', error);
          setUser(null);
        }
      }
      setIsLoading(false);
    };
    
    initAuth();
  }, []);
  
  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      playSound('success');
      toast.success('🎮 Login berhasil! Selamat datang kembali.', {
      });
      navigate('/dashboard');
    } catch (error: any) {
      playSound('error');
      toast.error(error.response?.data?.message || '❌ Login gagal. Silakan coba lagi.', {
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const register = async (credentials: RegisterCredentials) => {
    setIsLoading(true);
    try {
      const response = await authService.register(credentials);
      setUser(response.user);
      playSound('levelUp');
      toast.success('🎮 Registrasi berhasil! Selamat datang di Structopia.', {
      });
      navigate('/dashboard');
    } catch (error: any) {
      playSound('error');
      toast.error(error.response?.data?.message || '❌ Registrasi gagal. Silakan coba lagi.', {
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
      playSound('click');
      toast.info('👋 Anda telah keluar dari sistem.', {
      });
      navigate('/');
    } catch (error) {
      console.error('Logout error', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const refreshUser = async () => {
    setIsLoading(true);
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Failed to refresh user data', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};