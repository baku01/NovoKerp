import { useQuery } from '@tanstack/react-query';
import { useUserStore } from '../../stores/useUserStore';
import { fetchStockTransfers, fetchStockReturns, fetchTransferStatuses, fetchTransferWorksites } from './stockService';
import { TransferFilters } from './types';

export function useStockTransfers(filters: TransferFilters, mode: 'TRANSFER' | 'RETURN') {
    const empresa = useUserStore((state) => state.empresa);

    const itemsQuery = useQuery({
        queryKey: ['transfers', 'list', empresa, mode, filters],
        queryFn: () => mode === 'TRANSFER'
            ? fetchStockTransfers(empresa, filters)
            : fetchStockReturns(empresa, filters),
        enabled: !!empresa
    });

    const worksitesQuery = useQuery({
        queryKey: ['transfers', 'worksites', empresa],
        queryFn: () => fetchTransferWorksites(empresa),
        enabled: !!empresa
    });

    const statusesQuery = useQuery({
        queryKey: ['transfers', 'statuses', empresa, mode],
        queryFn: () => fetchTransferStatuses(empresa, mode),
        enabled: !!empresa
    });

    return {
        items: itemsQuery.data || [],
        worksites: worksitesQuery.data || [],
        statuses: statusesQuery.data || [],
        isLoading: itemsQuery.isLoading
    };
}
