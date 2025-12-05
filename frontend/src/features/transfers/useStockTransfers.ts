import { useQuery } from '@tanstack/react-query';
import { useUserStore } from '../../stores/useUserStore';
import { fetchStockTransfers, fetchStockReturns, fetchTransferStatuses, fetchTransferWorksites } from './stockService';
import { TransferFilters, StockTransfer, StockReturn } from './types';

export function useStockTransfers(filters: TransferFilters, mode: 'TRANSFER' | 'RETURN') {
    const empresa = useUserStore((state) => state.empresa);

    // Explicitly type the query result to be a union array
    const itemsQuery = useQuery<StockTransfer[] | StockReturn[]>({
        queryKey: ['transfers', 'list', empresa, mode, filters],
        queryFn: async () => {
            if (mode === 'TRANSFER') {
                return fetchStockTransfers(empresa, filters);
            } else {
                return fetchStockReturns(empresa, filters);
            }
        },
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
