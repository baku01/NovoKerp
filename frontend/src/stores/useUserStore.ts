import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id_user: string;
    us_nome: string;
    us_grup: string;
    us_empr: string;
    us_smd5: string;
    id_posi: number;
    id_oper: number;
    ws_http: string;
}

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
