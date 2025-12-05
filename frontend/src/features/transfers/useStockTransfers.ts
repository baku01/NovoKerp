import { useQuery } from '@tanstack/react-query';
import { useUserStore } from '../../stores/useUserStore';
import {
    fetchStockReturns,
    fetchStockTransfers,
    fetchStockWorksites,
    fetchStockWorksitesSingleDate,
    fetchStockStatuses
} from './stockService';
import { StockFilters, StockReturn, StockTransferRequest } from './types';

export function useStockTransfers(filters: StockFilters, type: 'TRANSFER' | 'RETURN') {
    const empresa = useUserStore((state) => state.empresa);
    const enabled = !!empresa && !!filters.startDate && !!filters.endDate;

    const worksitesQuery = useQuery({
        queryKey: ['stock', 'worksites', empresa, filters.startDate, filters.endDate, type],
        queryFn: () => type === 'RETURN' 
            ? fetchStockWorksites(empresa, filters.startDate, filters.endDate)
            : fetchStockWorksitesSingleDate(empresa), // Transfers (CestStLcto) seems to use SingleDate/All approach
        enabled: !!empresa
    });

    const statusesQuery = useQuery({
        queryKey: ['stock', 'statuses', empresa, type],
        queryFn: () => fetchStockStatuses(empresa, type),
        enabled: !!empresa
    });

    const listQuery = useQuery({
        queryKey: ['stock', 'list', empresa, type, filters],
        queryFn: async () => {
            if (type === 'RETURN') {
                return await fetchStockReturns(empresa, filters);
            } else {
                return await fetchStockTransfers(empresa, filters);
            }
        },
        enabled
    });

    return {
        items: (listQuery.data || []) as (StockReturn | StockTransferRequest)[],
        worksites: worksitesQuery.data || [],
        statuses: statusesQuery.data || [],
        isLoading: listQuery.isLoading || worksitesQuery.isLoading || statusesQuery.isLoading
    };
}
