import { create } from 'zustand';
import { User, UserRole } from '../types';
import { StorageService } from '../services/storage';
import { STORAGE_KEYS } from '../utils/constants';
import { generateId } from '../utils/helpers';

interface AuthState {
  user: User | null;
  users: User[];
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  loadUsers: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  users: [],
  isLoading: true,

  loadUsers: async () => {
    const users = await StorageService.get<User[]>(STORAGE_KEYS.USERS);
    const currentUser = await StorageService.get<User>(STORAGE_KEYS.CURRENT_USER);
    set({ users: users || [], user: currentUser, isLoading: false });
  },

  login: async (email: string, _password: string) => {
    const { users } = get();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      await StorageService.set(STORAGE_KEYS.CURRENT_USER, user);
      set({ user });
      return true;
    }
    return false;
  },

  logout: async () => {
    await StorageService.remove(STORAGE_KEYS.CURRENT_USER);
    set({ user: null });
  },

  register: async (name: string, email: string, _password: string, role: UserRole) => {
    const { users } = get();
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return false;
    }
    const newUser: User = {
      id: generateId(),
      name,
      email,
      role,
      createdAt: new Date().toISOString(),
    };
    const updatedUsers = [...users, newUser];
    await StorageService.set(STORAGE_KEYS.USERS, updatedUsers);
    await StorageService.set(STORAGE_KEYS.CURRENT_USER, newUser);
    set({ users: updatedUsers, user: newUser });
    return true;
  },
}));
