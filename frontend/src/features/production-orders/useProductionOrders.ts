import { useQuery } from '@tanstack/react-query';
import { useUserStore } from '../../stores/useUserStore';
import { fetchProductionOrders, fetchProductionOrderItems, fetchProductionOrderSituations } from './productionOrderService';
import { ProductionOrderFilter } from './types';

export function useProductionOrders(filters: ProductionOrderFilter) {
    const empresa = useUserStore((state) => state.empresa);
    const enabled = !!empresa && !!filters.worksiteId; // Legacy checks if worksiteId > 0

    const query = useQuery({
        queryKey: ['productionOrders', 'list', empresa, filters],
        queryFn: () => fetchProductionOrders(empresa, filters),
        enabled
    });

    return {
        orders: query.data || [],
        isLoading: query.isLoading
    };
}

export function useProductionOrderDetail(poNum: number | null) {
    const empresa = useUserStore((state) => state.empresa);
    const enabled = !!empresa && !!poNum;

    const itemsQuery = useQuery({
        queryKey: ['productionOrders', 'items', empresa, poNum],
        queryFn: () => fetchProductionOrderItems(empresa, poNum!),
        enabled
    });

    const situationsQuery = useQuery({
        queryKey: ['productionOrders', 'situations', empresa, poNum],
        queryFn: () => fetchProductionOrderSituations(empresa, poNum!),
        enabled
    });

    return {
        items: itemsQuery.data || [],
        situations: situationsQuery.data || [],
        isLoading: itemsQuery.isLoading || situationsQuery.isLoading
    };
}
