import { useMutation } from '@tanstack/react-query';
import { login } from './authService';
import { useUserStore } from '../../stores/useUserStore';
import { useNavigate } from 'react-router-dom';

export function useLogin() {
    const setUser = useUserStore((state) => state.setUser);
    const setEmpresa = useUserStore((state) => state.setEmpresa);
    const navigate = useNavigate();

    return useMutation({
        mutationFn: ({ username, password }: { username: string; password: string }) =>
            login(username, password),
        onSuccess: (data) => {
            setUser(data);
            if (data.us_empr) {
                setEmpresa(data.us_empr);
            }
            navigate('/dashboard');
        },
        onError: (error: Error) => {
            console.error('Login failed:', error);
        },
    });
}
