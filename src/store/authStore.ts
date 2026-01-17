import { create } from 'zustand';
import { User, UserRole } from '../types';
import { AuthAPI, setToken, clearToken, getToken } from '../services/api';
import { StorageService } from '../services/storage';
import { STORAGE_KEYS } from '../utils/constants';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  loadUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  error: null,

  loadUser: async () => {
    try {
      const token = await getToken();
      if (token) {
        const { user } = await AuthAPI.getMe();
        set({ user: { ...user, id: user._id || user.id }, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      await clearToken();
      set({ user: null, isLoading: false });
    }
  },

  login: async (email: string, password: string) => {
    try {
      set({ error: null });
      const { user, token } = await AuthAPI.login(email, password);
      await setToken(token);
      set({ user: { ...user, id: user._id || user.id } });
      return true;
    } catch (error: any) {
      set({ error: error.message || 'Login failed' });
      return false;
    }
  },

  logout: async () => {
    await clearToken();
    set({ user: null });
  },

  register: async (name: string, email: string, password: string, role: UserRole) => {
    try {
      set({ error: null });
      const { user, token } = await AuthAPI.register(name, email, password, role);
      await setToken(token);
      set({ user: { ...user, id: user._id || user.id } });
      return true;
    } catch (error: any) {
      set({ error: error.message || 'Registration failed' });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));
