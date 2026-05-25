import { create } from 'zustand';
import { api } from '../apis/api';

interface AuthState {
  isLoggedIn: boolean;
  isChecking: boolean;
  login: (token: string) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false, 
  isChecking: true, 
  
  login: (token) => {
    localStorage.setItem('accessToken', token);
    set({ isLoggedIn: true, isChecking: false });
  },
  
  logout: () => {
    localStorage.removeItem('accessToken');
    set({ isLoggedIn: false, isChecking: false });
  },
  
  checkAuth: async () => {
    try {

      const res = await api.post('/api/auth/reissue'); 

      const newAccessToken = res.data.accessToken;
      localStorage.setItem('accessToken', newAccessToken);
      
      set({ isLoggedIn: true, isChecking: false });
    } catch {
      localStorage.removeItem('accessToken');
      set({ isLoggedIn: false, isChecking: false });
    }
  },
}));