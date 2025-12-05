import { useQuery } from '@tanstack/react-query';
import { useUserStore } from '../../stores/useUserStore';
import { fetchStockMovements, fetchStockMovementDetails } from './stockMovementService';
import { StockMovementFilter } from './types';

export function useStockMovementList(filters: StockMovementFilter) {
    const empresa = useUserStore((state) => state.empresa);
    const enabled = !!empresa && !!filters.worksiteId;

    const query = useQuery({
        queryKey: ['stockMovement', 'list', empresa, filters],
        queryFn: () => fetchStockMovements(empresa, filters),
        enabled
    });

    return {
        movements: query.data || [],
        isLoading: query.isLoading
    };
}

export function useStockMovementDetail(docNum: number | null, type: string) {
    const empresa = useUserStore((state) => state.empresa);
    const enabled = !!empresa && !!docNum;

    const query = useQuery({
        queryKey: ['stockMovement', 'detail', empresa, docNum, type],
        queryFn: () => fetchStockMovementDetails(empresa, docNum!, type),
        enabled
    });

    return {
        details: query.data || [],
        isLoading: query.isLoading
    };
}
