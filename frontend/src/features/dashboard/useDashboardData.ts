import { useQuery } from '@tanstack/react-query';
import { fetchDashboardObras, fetchApontamentosDivergentes, fetchApontamentosPendentes } from './dashboardService';
import { useUserStore } from '../../stores/useUserStore';
import { format } from 'date-fns';

export function useDashboardData(date: Date = new Date()) {
    const user = useUserStore((state) => state.user);
    const empresa = useUserStore((state) => state.empresa);

    const formattedDate = format(date, 'yyyy-MM-dd');

    const obrasQuery = useQuery({
        queryKey: ['dashboard', 'obras', empresa, formattedDate],
        queryFn: () => fetchDashboardObras(user?.id_user || '', empresa, formattedDate),
        enabled: !!user && !!empresa,
    });

    const divergentesQuery = useQuery({
        queryKey: ['dashboard', 'divergentes', empresa, formattedDate],
        queryFn: () => fetchApontamentosDivergentes(user?.id_user || '', empresa, formattedDate),
        enabled: !!user && !!empresa,
    });

    const pendentesQuery = useQuery({
        queryKey: ['dashboard', 'pendentes', empresa, formattedDate],
        queryFn: () => fetchApontamentosPendentes(user?.id_user || '', empresa, formattedDate),
        enabled: !!user && !!empresa,
    });

    return {
        obras: obrasQuery.data || [],
        divergentes: divergentesQuery.data || [],
        pendentes: pendentesQuery.data || [],
        isLoading: obrasQuery.isLoading || divergentesQuery.isLoading || pendentesQuery.isLoading,
        error: obrasQuery.error || divergentesQuery.error || pendentesQuery.error,
    };
}
