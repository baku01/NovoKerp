import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUserStore } from '../../stores/useUserStore';
import {
    fetchSecullumAppointments,
    fetchSecullumAppointmentsByEmployee,
    fetchSecullumHistory,
    insertManualSecullum,
    updateSecullum,
    deleteSecullum,
} from './secullumService';
import { format } from 'date-fns';

export function useSecullumByWorksite(worksiteId: number, date: Date) {
    const empresa = useUserStore((state) => state.empresa);
    return useQuery({
        queryKey: ['secullum', 'worksite', empresa, worksiteId, format(date, 'yyyy-MM-dd')],
        queryFn: () => fetchSecullumAppointments(empresa, worksiteId, date),
        enabled: !!empresa && worksiteId > 0,
    });
}

export function useSecullumByEmployee(employeeId: number, date: Date) {
    const empresa = useUserStore((state) => state.empresa);
    return useQuery({
        queryKey: ['secullum', 'employee', empresa, employeeId, format(date, 'yyyy-MM-dd')],
        queryFn: () => fetchSecullumAppointmentsByEmployee(empresa, employeeId, date),
        enabled: !!empresa && employeeId > 0,
    });
}

export function useSecullumHistory(employeeId: number, date: Date) {
    const empresa = useUserStore((state) => state.empresa);
    return useQuery({
        queryKey: ['secullum', 'history', empresa, employeeId, format(date, 'yyyy-MM-dd')],
        queryFn: () => fetchSecullumHistory(empresa, employeeId, date),
        enabled: !!empresa && employeeId > 0,
    });
}

export function useSecullumMutations() {
    const queryClient = useQueryClient();
    const user = useUserStore((state) => state.user);
    const empresa = useUserStore((state) => state.empresa);

    const insertMutation = useMutation({
        mutationFn: (payload: { employeeId: number; date: Date; hent?: number; hiin?: number; htin?: number; hter?: number; justification: string }) => {
            if (!user) throw new Error('User not logged in');
            return insertManualSecullum(user.id_user, empresa, payload.employeeId, payload.date, {
                hent: payload.hent,
                hiin: payload.hiin,
                htin: payload.htin,
                hter: payload.hter,
                justification: payload.justification,
            });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['secullum'] }),
    });

    const updateMutation = useMutation({
        mutationFn: (payload: { appointmentId: number; hent?: number; hiin?: number; htin?: number; hter?: number; justification?: string }) => {
            if (!user) throw new Error('User not logged in');
            return updateSecullum(user.id_user, empresa, payload.appointmentId, payload);
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['secullum'] }),
    });

    const deleteMutation = useMutation({
        mutationFn: (appointmentId: number) => deleteSecullum(empresa, appointmentId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['secullum'] }),
    });

    return {
        insertSecullum: insertMutation.mutateAsync,
        updateSecullum: updateMutation.mutateAsync,
        deleteSecullum: deleteMutation.mutateAsync,
        isSaving: insertMutation.isPending || updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
    };
}
