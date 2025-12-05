import { useQuery } from '@tanstack/react-query';
import { useUserStore } from '../../stores/useUserStore';
import { format } from 'date-fns';
import {
    fetchServiceOrders,
    fetchWorksiteSummaryUpdate,
    fetchPremiumHours
} from './serviceOrderListService';

export function useServiceOrderList(
    idClie: number,
    date: Date
) {
    const empresa = useUserStore((state) => state.empresa);
    const formattedDate = format(date, 'yyyy-MM-dd');
    const enabled = !!empresa && idClie > 0;

    const ordersQuery = useQuery({
        queryKey: ['serviceOrders', 'list', empresa, idClie, formattedDate],
        queryFn: () => fetchServiceOrders(empresa, idClie, formattedDate),
        enabled
    });

    const summaryQuery = useQuery({
        queryKey: ['serviceOrders', 'summary', empresa, idClie, formattedDate],
        queryFn: () => fetchWorksiteSummaryUpdate(empresa, idClie, formattedDate),
        enabled
    });

    const premiumHoursQuery = useQuery({
        queryKey: ['serviceOrders', 'premium', empresa, idClie, formattedDate],
        queryFn: () => fetchPremiumHours(empresa, idClie, formattedDate),
        enabled
    });

    return {
        orders: ordersQuery.data || [],
        summary: summaryQuery.data?.[0] || null,
        premiumHours: premiumHoursQuery.data || [],
        isLoading: ordersQuery.isLoading || summaryQuery.isLoading || premiumHoursQuery.isLoading
    };
}
