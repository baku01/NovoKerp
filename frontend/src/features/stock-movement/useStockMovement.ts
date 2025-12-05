import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUserStore } from '../../stores/useUserStore';
import { fetchStockItemsForMovement, saveStockMovement } from './stockMovementService';
import { StockMovementHeader, StockMovementPayload } from './types';

export function useStockItems(header: StockMovementHeader, enabled: boolean) {
    const empresa = useUserStore((state) => state.empresa);

    // Extract fields relevant for fetching items to avoid refetching on observation change
    const { mv_obse, ...fetchParams } = header;

    const query = useQuery({
        queryKey: ['stock-movement', 'items', empresa, fetchParams],
        queryFn: () => fetchStockItemsForMovement(empresa, header),
        enabled: enabled && !!empresa && header.id_clie > 0
    });

    return {
        items: query.data || [],
        isLoading: query.isLoading,
        refetch: query.refetch
    };
}

export function useStockMovementMutation() {
    const user = useUserStore((state) => state.user);
    const empresa = useUserStore((state) => state.empresa);
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (payload: StockMovementPayload) => {
            if (!user) throw new Error("User not logged in");
            return saveStockMovement(user.id_user, empresa, payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['stock-movement'] });
            queryClient.invalidateQueries({ queryKey: ['stock-position'] });
        }
    });

    return {
        saveMovement: mutation.mutateAsync,
        isSaving: mutation.isPending
    };
}
