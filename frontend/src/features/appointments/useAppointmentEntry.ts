import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUserStore } from '../../stores/useUserStore';
import {
    fetchResources,
    fetchActivities,
    fetchStatusOptions,
    fetchJustifications,
    fetchResponsibilities,
    saveAppointment
} from './appointmentService';
import { format } from 'date-fns';
import { AppointmentPayload } from './types';

export function useAppointmentEntry(idClie: number, idOrds: number, date: Date) {
    const user = useUserStore((state) => state.user);
    const empresa = useUserStore((state) => state.empresa);
    const formattedDate = format(date, 'yyyy-MM-dd');
    const queryClient = useQueryClient();

    const enabled = !!user && !!empresa && idClie > 0;

    // 1. Resources
    const resourcesQuery = useQuery({
        queryKey: ['appointments', 'resources', empresa, idClie, formattedDate],
        queryFn: () => fetchResources(empresa, idClie, formattedDate),
        enabled
    });

    // 2. Activities
    const activitiesQuery = useQuery({
        queryKey: ['appointments', 'activities', empresa, idOrds],
        queryFn: () => fetchActivities(empresa, idOrds),
        enabled: enabled && idOrds > 0
    });

    // 3. Status Options (Cached)
    const statusQuery = useQuery({
        queryKey: ['appointments', 'status', empresa],
        queryFn: () => fetchStatusOptions(empresa),
        enabled: !!empresa,
        staleTime: Infinity
    });

    // 4. Justifications (Cached)
    const justQuery = useQuery({
        queryKey: ['appointments', 'justifications', empresa],
        queryFn: () => fetchJustifications(empresa),
        enabled: !!empresa,
        staleTime: Infinity
    });

    // 5. Responsibilities (Cached)
    const respQuery = useQuery({
        queryKey: ['appointments', 'responsibilities', empresa],
        queryFn: () => fetchResponsibilities(empresa),
        enabled: !!empresa,
        staleTime: Infinity
    });

    // Save Mutation
    const saveMutation = useMutation({
        mutationFn: (payload: Omit<AppointmentPayload, 'id_clie' | 'ap_data' | 'id_ords'>) => {
            if (!user) throw new Error("User not logged in");
            const fullPayload: AppointmentPayload = {
                ...payload,
                id_clie: idClie,
                ap_data: formattedDate,
                id_ords: idOrds,
            };
            return saveAppointment(user.id_user, empresa, fullPayload);
        },
        onSuccess: () => {
            // Invalidate relevant queries (e.g. Dashboard, Appointment History)
            queryClient.invalidateQueries({ queryKey: ['serviceOrder', 'details'] }); 
            // We might want to refetch resources if status changes
            queryClient.invalidateQueries({ queryKey: ['appointments', 'resources'] });
        }
    });

    return {
        resources: resourcesQuery.data || [],
        activities: activitiesQuery.data || [],
        statuses: statusQuery.data || [],
        justifications: justQuery.data || [],
        responsibilities: respQuery.data || [],
        
        isLoading: 
            resourcesQuery.isLoading || 
            activitiesQuery.isLoading || 
            statusQuery.isLoading ||
            justQuery.isLoading ||
            respQuery.isLoading,
            
        saveAppointment: saveMutation.mutateAsync,
        isSaving: saveMutation.isPending
    };
}
