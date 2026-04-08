import { create } from 'zustand';

interface AuthState {
  isLoggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,

  login: (token: string) => {
    localStorage.setItem('accessToken', token);
    set({ isLoggedIn: true });
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({ isLoggedIn: false });
    window.location.href = '/'; 
  },

  checkAuth: () => {
    const token = localStorage.getItem('accessToken');
    set({ isLoggedIn: !!token });
  },
}));