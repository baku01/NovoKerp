import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUserStore } from '../../stores/useUserStore';
import {
    fetchEvaluations,
    fetchEvaluationWorksites,
    fetchAllWorksites,
    searchEmployees,
    saveEvaluation,
    deleteEvaluation
} from './evaluationService';
import { EvaluationFilters, Evaluation } from './types';

export function useEvaluations(filters: EvaluationFilters) {
    const empresa = useUserStore((state) => state.empresa);
    const enabled = !!empresa;

    const queryKey = ['evaluations', 'list', empresa, filters];

    const query = useQuery({
        queryKey,
        queryFn: () => fetchEvaluations(empresa, filters),
        enabled
    });

    return {
        evaluations: query.data || [],
        isLoading: query.isLoading,
        refetch: query.refetch
    };
}

export function useEvaluationWorksites(startDate?: Date, endDate?: Date) {
    const empresa = useUserStore((state) => state.empresa);
    const query = useQuery({
        queryKey: ['evaluations', 'worksites', empresa, startDate, endDate],
        queryFn: () => fetchEvaluationWorksites(empresa, startDate, endDate),
        enabled: !!empresa
    });
    return { worksites: query.data || [], isLoading: query.isLoading };
}

export function useAllWorksites() {
    const empresa = useUserStore((state) => state.empresa);
    const query = useQuery({
        queryKey: ['worksites', 'all', empresa],
        queryFn: () => fetchAllWorksites(empresa),
        enabled: !!empresa
    });
    return { worksites: query.data || [], isLoading: query.isLoading };
}

export function useEvaluationMutations() {
    const user = useUserStore((state) => state.user);
    const empresa = useUserStore((state) => state.empresa);
    const queryClient = useQueryClient();

    const saveMutation = useMutation({
        mutationFn: (evaluation: Partial<Evaluation> & { fu_empr: string }) => {
            if (!user) throw new Error("User not logged in");
            return saveEvaluation(user.id_user, empresa, evaluation);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['evaluations'] });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (idAval: number) => {
            return deleteEvaluation(empresa, idAval);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['evaluations'] });
        }
    });

    return {
        saveEvaluation: saveMutation.mutateAsync,
        deleteEvaluation: deleteMutation.mutateAsync,
        isSaving: saveMutation.isPending,
        isDeleting: deleteMutation.isPending
    };
}

// Helper hook for employee search (could be moved to employee feature if shared)
export function useEmployeeSearch(worksiteId: number, searchTerm: string) {
    const empresa = useUserStore((state) => state.empresa);
    
    return useQuery({
        queryKey: ['employees', 'search', empresa, worksiteId, searchTerm],
        queryFn: () => searchEmployees(empresa, worksiteId, searchTerm),
        enabled: !!empresa && worksiteId > 0 && searchTerm.length > 2,
        staleTime: 1000 * 60 * 5
    });
}
