import { useQuery } from '@tanstack/react-query';
import { useUserStore } from '../../stores/useUserStore';
import { DailyReport } from './types';
import {
    fetchRdoResources,
    fetchRdoResourcesByDate,
    fetchRdoWorksitesByDate,
    fetchRdoOrdersByDate,
    checkRdoFinalized,
} from './dailyReportService';
import { format } from 'date-fns';

export function useDailyReportResources(report: DailyReport | null) {
    const empresa = useUserStore((state) => state.empresa);
    const enabled = !!empresa && !!report;
    const date = report ? new Date(report.ro_data) : new Date();
    return useQuery({
        queryKey: ['rdo', 'resources', empresa, report?.id_clie, format(date, 'yyyy-MM-dd')],
        queryFn: () => fetchRdoResources(empresa, report!.id_clie, date),
        enabled,
    });
}

export function useDailyReportResourcesByDate(worksiteId: number, date: Date) {
    const empresa = useUserStore((state) => state.empresa);
    const enabled = !!empresa && worksiteId > 0;
    return useQuery({
        queryKey: ['rdo', 'resourcesByDate', empresa, worksiteId, format(date, 'yyyy-MM-dd')],
        queryFn: () => fetchRdoResourcesByDate(empresa, worksiteId, date),
        enabled,
    });
}

export function useRdoWorksitesByDate(date: Date) {
    const empresa = useUserStore((state) => state.empresa);
    return useQuery({
        queryKey: ['rdo', 'worksitesByDate', empresa, format(date, 'yyyy-MM-dd')],
        queryFn: () => fetchRdoWorksitesByDate(empresa, date),
        enabled: !!empresa,
    });
}

export function useRdoOrdersByDate(worksiteId: number, date: Date) {
    const empresa = useUserStore((state) => state.empresa);
    return useQuery({
        queryKey: ['rdo', 'ordersByDate', empresa, worksiteId, format(date, 'yyyy-MM-dd')],
        queryFn: () => fetchRdoOrdersByDate(empresa, worksiteId, date),
        enabled: !!empresa && worksiteId > 0,
    });
}

export function useRdoFinalized(worksiteId: number, date: Date, orderId?: number | null) {
    const empresa = useUserStore((state) => state.empresa);
    return useQuery({
        queryKey: ['rdo', 'finalized', empresa, worksiteId, orderId ?? 0, format(date, 'yyyy-MM-dd')],
        queryFn: () => checkRdoFinalized(empresa, worksiteId, date, orderId),
        enabled: !!empresa && worksiteId > 0,
    });
}
