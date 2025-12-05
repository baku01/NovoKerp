import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUserStore } from '../../stores/useUserStore';
import {
    fetchPurchaseOrders,
    fetchPurchaseOrderItems,
    approvePurchaseOrder,
    disapprovePurchaseOrder
} from './purchasingService';
import { PurchasingFilters } from './types';

export function usePurchasing(filters: PurchasingFilters) {
    const empresa = useUserStore((state) => state.empresa);
    const query = useQuery({
        queryKey: ['purchasing', 'list', empresa, filters],
        queryFn: () => fetchPurchaseOrders(empresa, filters),
        enabled: !!empresa
    });

    return {
        orders: query.data || [],
        isLoading: query.isLoading
    };
}

export function usePurchaseOrderItems(idPcom: number | null) {
    const empresa = useUserStore((state) => state.empresa);
    const query = useQuery({
        queryKey: ['purchasing', 'items', empresa, idPcom],
        queryFn: () => fetchPurchaseOrderItems(idPcom!),
        enabled: !!empresa && !!idPcom
    });

    return {
        items: query.data || [],
        isLoading: query.isLoading
    };
}

export function usePurchasingMutations() {
    const user = useUserStore((state) => state.user);
    const empresa = useUserStore((state) => state.empresa);
    const queryClient = useQueryClient();

    const approveMutation = useMutation({
        mutationFn: (ids: number[]) => {
            if (!user) throw new Error("User not logged in");
            return approvePurchaseOrder(user.id_user, empresa, ids);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['purchasing', 'list'] });
        }
    });

    const disapproveMutation = useMutation({
        mutationFn: (ids: number[]) => {
            if (!user) throw new Error("User not logged in");
            return disapprovePurchaseOrder(user.id_user, empresa, ids);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['purchasing', 'list'] });
        }
    });

    return {
        approve: approveMutation.mutateAsync,
        disapprove: disapproveMutation.mutateAsync,
        isApproving: approveMutation.isPending,
        isDisapproving: disapproveMutation.isPending
    };
}
