import { useQuery } from '@tanstack/react-query';
import { useUserStore } from '../../stores/useUserStore';
import { format } from 'date-fns';
import {
    fetchObrasDefinidas,
    fetchTipos,
    fetchFuncoes,
    fetchQuantidadeRecursos,
    fetchDescricoesPlanejamentos,
    fetchEmployees,
    EmployeeFilters
} from './employeeService';

export function useEmployeesData(
    date: Date,
    filters: Partial<EmployeeFilters>
) {
    const user = useUserStore((state) => state.user);
    const empresa = useUserStore((state) => state.empresa);
    const formattedDate = format(date, 'yyyy-MM-dd');

    const userId = user?.id_user || '';

    // Auxiliary Data (Filters)
    const obrasQuery = useQuery({
        queryKey: ['employees', 'obras', empresa, formattedDate],
        queryFn: () => fetchObrasDefinidas(userId, empresa, formattedDate),
        enabled: !!user && !!empresa,
    });

    const tiposQuery = useQuery({
        queryKey: ['employees', 'tipos', empresa, formattedDate],
        queryFn: () => fetchTipos(userId, empresa, formattedDate),
        enabled: !!user && !!empresa,
    });

    const funcoesQuery = useQuery({
        queryKey: ['employees', 'funcoes', empresa, formattedDate],
        queryFn: () => fetchFuncoes(userId, empresa, formattedDate),
        enabled: !!user && !!empresa,
    });

    // Main Data
    const summaryQuery = useQuery({
        queryKey: ['employees', 'summary', empresa, formattedDate, filters.idCadt, filters.idCadtList],
        queryFn: () => fetchQuantidadeRecursos(
            empresa,
            filters.idCadt ?? null,
            filters.idCadtList ?? null,
            formattedDate
        ),
        enabled: !!user && !!empresa,
    });

    const planningQuery = useQuery({
        queryKey: ['employees', 'planning', empresa, formattedDate, filters.idCadt, filters.idCadtList],
        queryFn: () => fetchDescricoesPlanejamentos(
            empresa,
            filters.idCadt ?? null,
            filters.idCadtList ?? null,
            formattedDate
        ),
        enabled: !!user && !!empresa && !!summaryQuery.data, // Only fetch if summary is there (or parallel is fine too)
    });

    const employeesQuery = useQuery({
        queryKey: ['employees', 'list', empresa, formattedDate, filters],
        queryFn: () => fetchEmployees(
            userId,
            empresa,
            formattedDate,
            {
                idCadt: filters.idCadt ?? null,
                idCadtList: filters.idCadtList ?? null,
                tipo: filters.tipo ?? null,
                funcoes: filters.funcoes ?? null,
                idMatr: filters.idMatr ?? null,
                nome: filters.nome ?? null,
                pqEqto: filters.pqEqto ?? null
            }
        ),
        enabled: !!user && !!empresa,
    });

    return {
        obras: obrasQuery.data || [],
        tipos: tiposQuery.data || [],
        funcoes: funcoesQuery.data || [],
        summary: summaryQuery.data || [],
        planning: planningQuery.data || [],
        employees: employeesQuery.data || [],
        isLoading:
            obrasQuery.isLoading ||
            tiposQuery.isLoading ||
            funcoesQuery.isLoading ||
            summaryQuery.isLoading ||
            employeesQuery.isLoading,
        isFetchingEmployees: employeesQuery.isFetching
    };
}
