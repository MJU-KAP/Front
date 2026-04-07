import { create } from 'zustand';

interface AuthState {
  isLoggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: !!localStorage.getItem('accessToken'), 
  
  login: (token) => {
    localStorage.setItem('accessToken', token);
    set({ isLoggedIn: true });
  },
  
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({ isLoggedIn: false });
  },
  
  checkAuth: () => {
    const token = localStorage.getItem('accessToken');
    set({ isLoggedIn: !!token });
  },
}));