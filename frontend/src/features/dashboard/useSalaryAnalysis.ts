import { useQuery } from '@tanstack/react-query';
import { useUserStore } from '../../stores/useUserStore';
import {
    fetchSalaryWorksites,
    fetchSalaryChartData,
    fetchSalarySummaryData
} from './salaryService';
import { fetchResourceTypes } from './weeklyResourcesService'; // Reusing fetchSiglas

export function useSalaryAnalysis(
    worksiteId: number | null,
    startDate: Date,
    endDate: Date,
    functionSgla: string | null
) {
    const user = useUserStore((state) => state.user);
    const empresa = useUserStore((state) => state.empresa);
    
    // Format dates for API
    const startStr = startDate.toISOString().split('T')[0]; // Simple YYYY-MM-DD
    const endStr = endDate.toISOString().split('T')[0];

    const worksitesQuery = useQuery({
        queryKey: ['salary', 'worksites', user?.id_user, empresa],
        queryFn: () => fetchSalaryWorksites(user?.id_user || '', empresa),
        enabled: !!user && !!empresa,
    });

    const typesQuery = useQuery({
        queryKey: ['salary', 'types', empresa],
        queryFn: () => fetchResourceTypes(empresa),
        enabled: !!user && !!empresa,
    });

    const chartQuery = useQuery({
        queryKey: ['salary', 'chart', empresa, worksiteId, startStr, endStr, functionSgla],
        queryFn: () => fetchSalaryChartData(
            empresa,
            worksiteId,
            startStr,
            endStr,
            functionSgla
        ),
        enabled: !!user && !!empresa,
    });

    const summaryQuery = useQuery({
        queryKey: ['salary', 'summary', empresa, worksiteId, startStr, endStr],
        queryFn: () => fetchSalarySummaryData(
            empresa,
            worksiteId,
            startStr,
            endStr
        ),
        enabled: !!user && !!empresa,
    });

    return {
        worksites: worksitesQuery.data || [],
        resourceTypes: typesQuery.data || [],
        chartData: chartQuery.data || [],
        summaryData: summaryQuery.data || [],
        isLoading: worksitesQuery.isLoading || typesQuery.isLoading || chartQuery.isLoading || summaryQuery.isLoading,
    };
}
