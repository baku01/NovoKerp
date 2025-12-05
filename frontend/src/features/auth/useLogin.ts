import { useMutation } from '@tanstack/react-query';
import { login } from './authService';
import { useUserStore } from '../../stores/useUserStore';
import { useNavigate } from 'react-router-dom';

export function useLogin() {
    const setUser = useUserStore((state) => state.setUser);
    const navigate = useNavigate();

    return useMutation({
        mutationFn: ({ username, password }: { username: string; password: string }) =>
            login(username, password),
        onSuccess: (data) => {
            setUser(data);
            navigate('/dashboard');
        },
        onError: (error: Error) => {
            console.error('Login failed:', error);
        },
    });
}
