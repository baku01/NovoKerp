import { useQuery } from '@tanstack/react-query';
import { useUserStore } from '../../stores/useUserStore';
import {
    fetchStockPosition,
    fetchWorksites,
    fetchServiceOrders,
    fetchEmployees
} from './stockPositionService';
import { StockPositionFilters } from './types';

export function useStockPosition(filters: StockPositionFilters) {
    const empresa = useUserStore((state) => state.empresa);
    const enabled = !!empresa && filters.worksiteId > 0;

    const query = useQuery({
        queryKey: ['stock-position', empresa, filters],
        queryFn: () => fetchStockPosition(empresa, filters),
        enabled
    });

    return {
        data: query.data || [],
        isLoading: query.isLoading
    };
}

export function useWorksites(filters: Partial<StockPositionFilters>) {
    const empresa = useUserStore((state) => state.empresa);
    // Legacy fetches worksites based on date/period
    const enabled = !!empresa && (
        (filters.type === 'U' && !!filters.startDate && !!filters.endDate) ||
        (filters.type === 'A' && !!filters.date)
    );

    const query = useQuery({
        queryKey: ['stock-position', 'worksites', empresa, filters.type, filters.date, filters.startDate, filters.endDate],
        queryFn: () => fetchWorksites(empresa, filters),
        enabled
    });

    return { worksites: query.data || [], isLoading: query.isLoading };
}

export function useServiceOrders(worksiteId: number) {
    const empresa = useUserStore((state) => state.empresa);
    const query = useQuery({
        queryKey: ['stock-position', 'orders', empresa, worksiteId],
        queryFn: () => fetchServiceOrders(empresa, worksiteId),
        enabled: !!empresa && worksiteId > 0
    });
    return { orders: query.data || [], isLoading: query.isLoading };
}

export function useEmployees(worksiteId: number, filters: { date?: Date, startDate?: Date, endDate?: Date, type: 'U' | 'A' }) {
    const empresa = useUserStore((state) => state.empresa);
    const query = useQuery({
        queryKey: ['stock-position', 'employees', empresa, worksiteId, filters],
        queryFn: () => fetchEmployees(empresa, worksiteId, filters),
        enabled: !!empresa && worksiteId > 0
    });
    return { employees: query.data || [], isLoading: query.isLoading };
}
