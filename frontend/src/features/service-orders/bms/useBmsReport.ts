import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useUserStore } from '../../../stores/useUserStore';
import { fetchBmsHourRates, fetchBmsJourneys, fetchBmsResourceRecords } from './bmsService';
import { buildBmsRows } from './bmsCalculations';
import type { BmsFilters, BmsReportRow, BmsSummary } from './types';
import type { ServiceOrder } from '../../stock-position/types';

interface UseBmsReportParams {
    filters: BmsFilters;
    selectedOrderIds: number[];
    allOrderIds: number[];
    orders: ServiceOrder[];
    enabled: boolean;
}

interface UseBmsReportResult {
    rows: BmsReportRow[];
    summary: BmsSummary | null;
    isLoading: boolean;
    isFetching: boolean;
    isError: boolean;
    error: Error | null;
    refetch: () => void;
}

export function useBmsReport({
    filters,
    selectedOrderIds,
    allOrderIds,
    orders,
    enabled,
}: UseBmsReportParams): UseBmsReportResult {
    const empresa = useUserStore((state) => state.empresa);

    const keyFilters = useMemo(
        () => ({
            worksiteId: filters.worksiteId,
            startDate: filters.startDate.toISOString(),
            endDate: filters.endDate.toISOString(),
        }),
        [filters]
    );

    const query = useQuery({
        queryKey: [
            'bms-report',
            empresa,
            keyFilters,
            selectedOrderIds.slice().sort(),
            allOrderIds.slice().sort(),
        ],
        enabled:
            enabled &&
            !!empresa &&
            filters.worksiteId > 0 &&
            selectedOrderIds.length > 0 &&
            allOrderIds.length > 0,
        staleTime: 1000 * 60 * 5,
        queryFn: async () => {
            if (!empresa) {
                throw new Error('Empresa não encontrada na sessão');
            }

            const [journeys, hourRates, records] = await Promise.all([
                fetchBmsJourneys(empresa, selectedOrderIds),
                fetchBmsHourRates(empresa, selectedOrderIds),
                fetchBmsResourceRecords(
                    empresa,
                    filters.worksiteId,
                    allOrderIds,
                    filters.startDate,
                    filters.endDate
                ),
            ]);

            return buildBmsRows({
                records,
                selectedOrderIds,
                hourRates,
                journeys,
                orders,
            });
        },
    });

    return {
        rows: query.data?.rows ?? [],
        summary: query.data?.summary ?? null,
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isError: query.isError,
        error: (query.error as Error) ?? null,
        refetch: () => query.refetch(),
    };
}
