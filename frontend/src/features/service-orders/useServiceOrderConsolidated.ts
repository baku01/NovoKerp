import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useUserStore } from '../../stores/useUserStore';
import {
    fetchAppointmentSituations,
    fetchPlannedActualHours,
    fetchServiceOrderDashboardDetail,
    ServiceOrderDashboardDetail,
    ServiceOrderPlannedActual,
    ServiceOrderSituation
} from './serviceOrderConsolidatedService';

export function useServiceOrderConsolidated(worksiteId: number, orderId: number, date: Date) {
    const empresa = useUserStore((state) => state.empresa);
    const formattedDate = format(date, 'yyyy-MM-dd');
    const enabled = !!empresa && worksiteId > 0 && orderId > 0;

    const plannedActualQuery = useQuery({
        queryKey: ['serviceOrders', 'consolidated', 'planned', empresa, worksiteId, orderId, formattedDate],
        queryFn: () => fetchPlannedActualHours(empresa, worksiteId, orderId, formattedDate),
        enabled,
    });

    const situationsQuery = useQuery({
        queryKey: ['serviceOrders', 'consolidated', 'situations', empresa, worksiteId, orderId, formattedDate],
        queryFn: () => fetchAppointmentSituations(empresa, worksiteId, orderId, formattedDate),
        enabled,
    });

    const detailQuery = useQuery({
        queryKey: ['serviceOrders', 'consolidated', 'detail', empresa, worksiteId, orderId, formattedDate],
        queryFn: () => fetchServiceOrderDashboardDetail(empresa, worksiteId, orderId, formattedDate),
        enabled,
    });

    return {
        plannedActual: (plannedActualQuery.data || [])[0] as ServiceOrderPlannedActual | undefined,
        situations: situationsQuery.data || [] as ServiceOrderSituation[],
        detail: (detailQuery.data || [])[0] as ServiceOrderDashboardDetail | undefined,
        isLoading: plannedActualQuery.isLoading || situationsQuery.isLoading || detailQuery.isLoading,
        refetch: () => {
            plannedActualQuery.refetch();
            situationsQuery.refetch();
            detailQuery.refetch();
        },
    };
}
