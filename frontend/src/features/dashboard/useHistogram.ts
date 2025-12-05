import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUserStore } from '../../stores/useUserStore';
import { format } from 'date-fns';
import {
    fetchHistogramResources,
    updateHistogramConfig,
    updateHistogramClientName
} from './histogramService';

export function useHistogram(date: Date) {
    const user = useUserStore((state) => state.user);
    const empresa = useUserStore((state) => state.empresa);
    const formattedDate = format(date, 'yyyy-MM-dd');
    const queryClient = useQueryClient();

    const queryKey = ['histogram', empresa, formattedDate];

    const query = useQuery({
        queryKey,
        queryFn: () => fetchHistogramResources(empresa, formattedDate),
        enabled: !!user && !!empresa,
    });

    const configMutation = useMutation({
        mutationFn: (variables: { min: number, max: number }) => {
            return updateHistogramConfig(empresa, variables.min, variables.max, formattedDate);
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey })
    });

    const renameMutation = useMutation({
        mutationFn: (variables: { idClie: number, name: string }) => {
            if (!user) throw new Error("User missing");
            return updateHistogramClientName(user.id_user, empresa, variables.idClie, variables.name, formattedDate);
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey })
    });

    return {
        resources: query.data || [],
        isLoading: query.isLoading,
        updateConfig: configMutation.mutateAsync,
        renameClient: renameMutation.mutateAsync,
        isUpdating: configMutation.isPending || renameMutation.isPending
    };
}
