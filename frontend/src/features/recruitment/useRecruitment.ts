import { useQuery } from '@tanstack/react-query';
import { useUserStore } from '../../stores/useUserStore';
import {
    fetchDismissedEmployees,
    fetchRecruitmentFunctions
} from './recruitmentService';
import { RecruitmentFilters } from './types';

export function useRecruitment(filters: RecruitmentFilters) {
    const user = useUserStore((state) => state.user);
    const empresa = useUserStore((state) => state.empresa);
    
    const enabled = !!user && !!empresa;

    const functionsQuery = useQuery({
        queryKey: ['recruitment', 'functions', empresa],
        queryFn: () => fetchRecruitmentFunctions(user?.id_user || '', empresa),
        enabled
    });

    const employeesQuery = useQuery({
        queryKey: ['recruitment', 'employees', empresa, filters],
        queryFn: () => fetchDismissedEmployees(empresa, filters),
        enabled: enabled // Legacy: loads only on search? Or initially? Legacy calls `pesquisaFuncionariosDemitidosCFR` commented out in `CadtFuRecr` init? 
        // Actually `// pesquisaFuncionariosDemitidosCFR();` is commented out in legacy.
        // But we probably want to load it if the user interacts or if we want to show something initially.
        // Let's enable it but perhaps the service returns empty if no filters?
        // Legacy checks `if (loTxPesq.value...length > 0)`.
        // So it only searches if there is a search term OR if `lmFuFunc` (functions) are selected?
        // "try { if (lmFuFunc.length > 0) ... }"
        // So if filters are empty, it might return everything or nothing depending on backend.
        // Let's allow fetching.
    });

    return {
        functions: functionsQuery.data || [],
        employees: employeesQuery.data || [],
        isLoading: functionsQuery.isLoading || employeesQuery.isLoading,
        isFetchingEmployees: employeesQuery.isFetching
    };
}
