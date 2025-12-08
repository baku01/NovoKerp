import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from './taskService';
import { useUserStore } from '../../stores/useUserStore';

export function useTasks(idOrds: number) {
    const user = useUserStore((state) => state.user);
    const idEmpr = user?.us_empr || '';

    return useQuery({
        queryKey: ['tasks', idEmpr, idOrds],
        queryFn: () => taskService.getTasks(idEmpr, idOrds),
        enabled: !!idEmpr && idOrds > 0,
    });
}

export function useUpdateRemainingDays() {
    const queryClient = useQueryClient();
    const user = useUserStore((state) => state.user);
    const idEmpr = user?.us_empr || '';

    return useMutation({
        mutationFn: ({
            idOrds,
            idExcl,
            idAtiv,
            apDres,
        }: {
            idOrds: number;
            idExcl: number;
            idAtiv: number;
            apDres: number;
        }) => taskService.updateRemainingDays(idEmpr, idOrds, idExcl, idAtiv, apDres),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });
}
