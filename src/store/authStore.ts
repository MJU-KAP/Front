import { create } from 'zustand';

const isTokenValid = (token: string | null) => {
  if (!token) return false;
  try {

    const payloadBase64 = token.split('.')[1];
    const decodedJson = atob(payloadBase64);
    const decoded = JSON.parse(decodedJson);

    const expirationTime = decoded.exp * 1000;
    return Date.now() < expirationTime;
  } catch {
    return false;
  }
};

interface AuthState {
  isLoggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: isTokenValid(localStorage.getItem('accessToken')), 
  
  login: (token) => {
    localStorage.setItem('accessToken', token);
    set({ isLoggedIn: true });
  },
  
  logout: () => {
    localStorage.removeItem('accessToken');
    set({ isLoggedIn: false });
  },
  
  checkAuth: () => {
    const token = localStorage.getItem('accessToken');
    const isValid = isTokenValid(token);

    if (!isValid && token) {
      localStorage.removeItem('accessToken');
    }

    set({ isLoggedIn: isValid });
  },
}));