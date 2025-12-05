import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useUserStore } from '../../stores/useUserStore';
import { format } from 'date-fns';
import { fetchPremiumHours } from './serviceOrderListService';
import { insertPremiumHour, deletePremiumHour } from './premiumHoursService';

export function usePremiumHours(idClie: number, date: Date) {
    const user = useUserStore((state) => state.user);
    const empresa = useUserStore((state) => state.empresa);
    const formattedDate = format(date, 'yyyy-MM-dd');
    const queryClient = useQueryClient();

    const queryKey = ['serviceOrders', 'premium', empresa, idClie, formattedDate];

    // Fetch
    const { data: premiumHours = [], isLoading } = useQuery({
        queryKey,
        queryFn: () => fetchPremiumHours(empresa, idClie, formattedDate),
        enabled: !!user && !!empresa && idClie > 0,
    });

    // Insert Mutation
    const insertMutation = useMutation({
        mutationFn: (variables: {
            positionDate: Date,
            recordDate: Date,
            timeStr: string, // "HH:MM"
            description: string
        }) => {
            if (!user) throw new Error("User not logged in");
            
            // Convert HH:MM to Legacy Decimal (e.g. 1:30 -> 1.30)
            const [h, m] = variables.timeStr.split(':');
            const decimalTime = parseFloat(`${h}.${m}`);

            return insertPremiumHour(
                user.id_user,
                empresa,
                idClie,
                format(variables.positionDate, 'yyyy-MM-dd'),
                format(variables.recordDate, 'yyyy-MM-dd'),
                decimalTime,
                variables.description
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        }
    });

    // Delete Mutation
    const deleteMutation = useMutation({
        mutationFn: (variables: { idHrpr: number, recordDate: string }) => {
            if (!user) throw new Error("User not logged in");
            return deletePremiumHour(
                user.id_user,
                empresa,
                variables.idHrpr,
                idClie,
                variables.recordDate
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        }
    });

    return {
        premiumHours,
        isLoading,
        insertPremiumHour: insertMutation.mutateAsync,
        deletePremiumHour: deleteMutation.mutateAsync,
        isInserting: insertMutation.isPending,
        isDeleting: deleteMutation.isPending
    };
}
