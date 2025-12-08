import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentService } from './commentService';
import { useUserStore } from '../../stores/useUserStore';

export function useComment(idClie: number, idOrds: number, cmData: string) {
    const user = useUserStore((state) => state.user);
    const idEmpr = user?.us_empr || '';

    return useQuery({
        queryKey: ['comment', idEmpr, idClie, idOrds, cmData],
        queryFn: () => commentService.getComment(idEmpr, idClie, idOrds, cmData),
        enabled: !!idEmpr && idClie > 0 && idOrds > 0 && !!cmData,
    });
}

export function useServiceOrderSearch() {
    const user = useUserStore((state) => state.user);
    const idEmpr = user?.us_empr || '';

    return useMutation({
        mutationFn: ({ idCadt, osNume }: { idCadt: number; osNume: string }) =>
            commentService.searchServiceOrder(idEmpr, idCadt, osNume),
    });
}

export function useSaveComment() {
    const queryClient = useQueryClient();
    const user = useUserStore((state) => state.user);
    const idEmpr = user?.us_empr || '';

    return useMutation({
        mutationFn: ({
            idClie,
            idOrds,
            cmData,
            cmDesc,
        }: {
            idClie: number;
            idOrds: number;
            cmData: string;
            cmDesc: string;
        }) => commentService.saveComment(idEmpr, idClie, idOrds, cmData, cmDesc),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comment'] });
        },
    });
}
