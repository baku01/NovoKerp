import { useQuery, useQueries } from '@tanstack/react-query';
import { useUserStore } from '../../stores/useUserStore';
import { format, addDays } from 'date-fns';
import {
    fetchWorksitesWithResources,
    fetchResourceTypes,
    fetchRealResourceUsage,
    fetchUpdatedResourceUsage,
    UpdatedResourceUsage
} from './weeklyResourcesService';

export function useWeeklyResources(
    date: Date,
    selectedWorksiteIds: string[],
    selectedResourceTypes: string[]
) {
    const user = useUserStore((state) => state.user);
    const empresa = useUserStore((state) => state.empresa);
    const formattedDate = format(date, 'yyyy-MM-dd');

    // 1. Fetch Metadata (Worksites & Types)
    const worksitesQuery = useQuery({
        queryKey: ['weeklyResources', 'worksites', empresa, formattedDate],
        queryFn: () => fetchWorksitesWithResources(empresa, formattedDate),
        enabled: !!user && !!empresa,
    });

    const typesQuery = useQuery({
        queryKey: ['weeklyResources', 'types', empresa],
        queryFn: () => fetchResourceTypes(empresa),
        enabled: !!user && !!empresa,
    });

    // 2. Fetch "Real" Usage
    // Only fetch if we have selections? Legacy fetched on load if I recall.
    // But we need worksites and types to be selected or "all" logic.
    // We'll pass what we have.
    
    const realUsageQuery = useQuery({
        queryKey: ['weeklyResources', 'real', empresa, formattedDate, selectedWorksiteIds, selectedResourceTypes],
        queryFn: () => fetchRealResourceUsage(
            empresa, 
            formattedDate, 
            selectedWorksiteIds, 
            selectedResourceTypes
        ),
        enabled: !!user && !!empresa,
    });

    // 3. Calculate Dates for "Updated" Usage
    // Logic: Iterate from selected date until `pm_dtat` (from real usage), picking Mon/Thu.
    const updateDates: Date[] = [];
    if (realUsageQuery.data && realUsageQuery.data.length > 0) {
        const firstRecord = realUsageQuery.data[0];
        if (firstRecord.pm_dtat) {
             // Parse the date. The API returns ISO-ish or handled by parser?
             // Service interface says string. The legacy used `jsonDate` then `stringDataParaObjetoData`.
             // Assuming ISO string in Typescript interface for now, if not we need to handle it.
             // `pm_dtat` likely comes as "2023-10-25T00:00:00".
             let endDate: Date;
             try {
                 endDate = new Date(firstRecord.pm_dtat);
             } catch {
                 endDate = new Date(); // Fallback
             }
             
             let currentDate = new Date(date); // Start from selected date
             
             // Sanity check to avoid infinite loops if dates are weird
             const maxIterations = 365; 
             let iterations = 0;

             while (currentDate <= endDate && iterations < maxIterations) {
                 const day = currentDate.getDay(); // 0=Sun, 1=Mon, ..., 4=Thu
                 if (day === 1 || day === 4) {
                     updateDates.push(new Date(currentDate));
                 }
                 currentDate = addDays(currentDate, 1);
                 iterations++;
             }
        }
    }

    // 4. Fetch "Updated" Usage for each date
    const updatedUsageQueries = useQueries({
        queries: updateDates.map((d) => {
            const dStr = format(d, 'yyyy-MM-dd');
            return {
                queryKey: ['weeklyResources', 'updated', empresa, dStr, selectedWorksiteIds, selectedResourceTypes],
                queryFn: () => fetchUpdatedResourceUsage(empresa, dStr, selectedWorksiteIds, selectedResourceTypes),
                enabled: !!user && !!empresa && updateDates.length > 0,
            };
        }),
    });

    const isUpdatedLoading = updatedUsageQueries.some(q => q.isLoading);
    
    // Combine updated usage results
    // Map: DateString -> List of Usage
    const updatedUsageMap: Record<string, UpdatedResourceUsage[]> = {};
    
    updatedUsageQueries.forEach((q, index) => {
        if (q.data) {
            const dateStr = format(updateDates[index], 'yyyy-MM-dd');
            updatedUsageMap[dateStr] = q.data;
        }
    });

    return {
        worksites: worksitesQuery.data || [],
        resourceTypes: typesQuery.data || [],
        realUsage: realUsageQuery.data || [],
        updateDates, // The columns
        updatedUsageMap,
        isLoading: worksitesQuery.isLoading || typesQuery.isLoading || realUsageQuery.isLoading || isUpdatedLoading,
    };
}
