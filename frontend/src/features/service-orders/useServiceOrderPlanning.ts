import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUserStore } from '../../stores/useUserStore';
import {
    fetchServiceOrderProgress,
    fetchServiceOrderEvolution,
    fetchServiceOrderSituations,
    updateServiceOrderSituation,
    deleteServiceOrderSituation
} from './planningService';

export function useServiceOrderPlanning(idClie: number, idOrds: number) {
    const user = useUserStore((state) => state.user);
    const empresa = useUserStore((state) => state.empresa);
    const queryClient = useQueryClient();
    const enabled = !!user && !!empresa && idOrds > 0;

    // 1. Progress / Percent
    const progressQuery = useQuery({
        queryKey: ['planning', 'progress', empresa, idClie, idOrds],
        queryFn: () => fetchServiceOrderProgress(empresa, idClie, idOrds, 0), // 0 to fetch current?
        enabled
    });

    // 2. Evolution / Stats
    const evolutionQuery = useQuery({
        queryKey: ['planning', 'evolution', empresa, idOrds],
        queryFn: () => fetchServiceOrderEvolution(empresa, idOrds),
        enabled
    });

    // 3. Situations History
    const situationsQuery = useQuery({
        queryKey: ['planning', 'situations', empresa, idOrds],
        queryFn: () => fetchServiceOrderSituations(empresa, idOrds),
        enabled
    });

    // Mutations
    const updateProgressMutation = useMutation({
        mutationFn: (percent: number) => fetchServiceOrderProgress(empresa, idClie, idOrds, percent),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['planning', 'progress'] });
        }
    });

    const addSituationMutation = useMutation({
        mutationFn: (situation: string) => {
            if (!user) throw new Error("User not logged in");
            return updateServiceOrderSituation(user.id_user, empresa, idOrds, situation);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['planning', 'situations'] });
        }
    });

    const deleteSituationMutation = useMutation({
        mutationFn: (variables: { situation: string, date: string }) => {
            if (!user) throw new Error("User not logged in");
            return deleteServiceOrderSituation(user.id_user, empresa, idOrds, variables.situation, variables.date);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['planning', 'situations'] });
        }
    });

    return {
        progress: progressQuery.data?.[0] || null,
        evolution: evolutionQuery.data?.[0] || null,
        situations: situationsQuery.data || [],
        isLoading: progressQuery.isLoading || evolutionQuery.isLoading || situationsQuery.isLoading,
        updateProgress: updateProgressMutation.mutateAsync,
        addSituation: addSituationMutation.mutateAsync,
        deleteSituation: deleteSituationMutation.mutateAsync,
        isUpdatingProgress: updateProgressMutation.isPending,
        isAddingSituation: addSituationMutation.isPending
    };
}
