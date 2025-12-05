import { useQuery } from '@tanstack/react-query';
import { useUserStore } from '../../stores/useUserStore';
import { format } from 'date-fns';
import {
    fetchServiceOrderDetails,
    fetchInternalAppointments,
    fetchAppointmentStatus,
    fetchStoppedAppointments,
    fetchPlannedRealizedComparison,
    fetchWorkShifts,
    fetchAppointmentRecords
} from './serviceOrderService';
import { calculateTotalOvertimeMinutes } from './overtimeCalculator';

export function useServiceOrder(
    idClie: number,
    idOrds: number,
    date: Date
) {
    const user = useUserStore((state) => state.user);
    const empresa = useUserStore((state) => state.empresa);
    const formattedDate = format(date, 'yyyy-MM-dd');

    const enabled = !!user && !!empresa && idOrds > 0;

    // 1. Details
    const detailsQuery = useQuery({
        queryKey: ['serviceOrder', 'details', empresa, idClie, idOrds, formattedDate],
        queryFn: () => fetchServiceOrderDetails(empresa, idClie, idOrds, formattedDate),
        enabled
    });

    // 2. Internal Appointments
    const internalQuery = useQuery({
        queryKey: ['serviceOrder', 'internal', empresa, idClie, idOrds],
        queryFn: () => fetchInternalAppointments(empresa, idClie, idOrds),
        enabled
    });

    // 3. Status
    const statusQuery = useQuery({
        queryKey: ['serviceOrder', 'status', empresa, idClie, idOrds, formattedDate],
        queryFn: () => fetchAppointmentStatus(empresa, idClie, idOrds, formattedDate),
        enabled
    });

    // 4. Stopped
    const stoppedQuery = useQuery({
        queryKey: ['serviceOrder', 'stopped', empresa, idClie, idOrds, formattedDate],
        queryFn: () => fetchStoppedAppointments(empresa, idClie, idOrds, formattedDate),
        enabled
    });

    // 5. Planned vs Realized
    const comparisonQuery = useQuery({
        queryKey: ['serviceOrder', 'comparison', empresa, idClie, idOrds, formattedDate],
        queryFn: () => fetchPlannedRealizedComparison(empresa, idClie, idOrds, formattedDate),
        enabled
    });

    // 6. Overtime Calculation Data (Shifts + Records)
    const shiftsQuery = useQuery({
        queryKey: ['serviceOrder', 'shifts', empresa, idOrds],
        queryFn: () => fetchWorkShifts(empresa, idOrds),
        enabled
    });

    const recordsQuery = useQuery({
        queryKey: ['serviceOrder', 'records', empresa, idClie, idOrds],
        queryFn: () => fetchAppointmentRecords(empresa, idClie, idOrds),
        enabled
    });

    // Calculate Overtime
    const overtimeMinutes = (recordsQuery.data && shiftsQuery.data) 
        ? calculateTotalOvertimeMinutes(recordsQuery.data, shiftsQuery.data)
        : 0;

    return {
        details: detailsQuery.data?.[0] || null,
        internalAppointments: internalQuery.data || [],
        appointmentStatus: statusQuery.data || [],
        stoppedAppointments: stoppedQuery.data || [],
        comparison: comparisonQuery.data?.[0] || null,
        overtimeMinutes,
        isLoading: 
            detailsQuery.isLoading || 
            internalQuery.isLoading || 
            statusQuery.isLoading || 
            stoppedQuery.isLoading ||
            comparisonQuery.isLoading ||
            shiftsQuery.isLoading ||
            recordsQuery.isLoading,
        // Expose specific loading states if needed
        isOvertimeLoading: shiftsQuery.isLoading || recordsQuery.isLoading
    };
}
