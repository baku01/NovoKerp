import { useQuery } from '@tanstack/react-query';
import { useUserStore } from '../../stores/useUserStore';
import { fetchStockPosition, fetchStockEmployees, fetchStockOrders } from './stockPositionService';
import { StockPositionFilters } from './types';

export function useStockPosition(filters: StockPositionFilters) {
    const empresa = useUserStore((state) => state.empresa);
    const enabled = !!empresa && !!filters.worksiteId;

    const positionQuery = useQuery({
        queryKey: ['stock', 'position', empresa, filters],
        queryFn: () => fetchStockPosition(empresa, filters),
        enabled: enabled && (
            (filters.mode === 'POSITION' && !!filters.date) || 
            (filters.mode === 'CONSUMPTION' && !!filters.startDate && !!filters.endDate)
        )
    });

    const employeesQuery = useQuery({
        queryKey: ['stock', 'employees', empresa, filters.worksiteId, filters.mode, filters.date, filters.startDate, filters.endDate],
        queryFn: () => fetchStockEmployees(empresa, filters.worksiteId!, filters),
        enabled: enabled
    });

    const ordersQuery = useQuery({
        queryKey: ['stock', 'orders', empresa, filters.worksiteId],
        queryFn: () => fetchStockOrders(empresa, filters.worksiteId!),
        enabled: enabled && filters.mode === 'CONSUMPTION'
    });

    return {
        stockItems: positionQuery.data || [],
        employees: employeesQuery.data || [],
        orders: ordersQuery.data || [],
        isLoading: positionQuery.isLoading || employeesQuery.isLoading || ordersQuery.isLoading
    };
}
