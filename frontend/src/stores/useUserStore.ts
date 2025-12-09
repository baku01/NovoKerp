import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';

interface UserStore {
  user: User | null;
  empresa: string;
  setUser: (user: User) => void;
  setEmpresa: (empresa: string) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      empresa: '',
      setUser: (user) => set({ user }),
      setEmpresa: (empresa) => set({ empresa }),
      logout: () => set({ user: null, empresa: '' }),
    }),
    {
      name: 'soCdUser', // Same key as legacy app for compatibility
    }
  )
);
