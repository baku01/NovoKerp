import { useQuery } from '@tanstack/react-query';
import { useUserStore } from '../../stores/useUserStore';
import { DivergenceFilters, AppointmentDivergence } from './types';
import { fetchDivergences, fetchDivergenceWorksites, fetchStatusOptions } from './divergenceService';
import { calculateMinutesFromRecord } from './divergenceUtils'; // We need to create this

export function useDivergences(filters: DivergenceFilters) {
    const empresaId = useUserStore((state) => state.empresa);
    const enabled = !!empresaId && !!filters.startDate && !!filters.endDate;

    const worksitesQuery = useQuery({
        queryKey: ['divergences', 'worksites', empresaId, filters.startDate, filters.endDate],
        queryFn: () => fetchDivergenceWorksites(empresaId, filters.startDate!, filters.endDate!),
        enabled: !!empresaId && !!filters.startDate && !!filters.endDate
    });

    const statusQuery = useQuery({
        queryKey: ['divergences', 'status', empresaId, filters.worksiteId, filters.startDate, filters.endDate],
        queryFn: () => fetchStatusOptions(empresaId, filters.worksiteId, filters.startDate!, filters.endDate!),
        enabled: !!empresaId && !!filters.startDate && !!filters.endDate
    });

    const query = useQuery({
        queryKey: ['divergences', 'list', empresaId, filters],
        queryFn: async () => {
            const rawData = await fetchDivergences(empresaId, filters);
            // Process raw data to find divergences
            return processDivergences(rawData, filters.statusId);
        },
        enabled
    });

    return {
        divergences: query.data || [],
        worksites: worksitesQuery.data || [],
        statuses: statusQuery.data || [],
        isLoading: query.isLoading || worksitesQuery.isLoading
    };
}

// Logic ported from legacy `pesquisaApontamentosAplicativoSecullumPeriodoCAD`
function processDivergences(rawData: any[], statusFilter: number | null): AppointmentDivergence[] {
    const appRecords = rawData.filter(r => r.ap_tipo === 'A');
    const secuRecords = rawData.filter(r => r.ap_tipo === 'S');
    const divergences: AppointmentDivergence[] = [];

    // Helper to group by unique employee+date
    const keys = new Set<string>();
    rawData.forEach(r => keys.add(`${r.id_matr}|${r.fu_empr}|${r.ap_data}`));

    keys.forEach(key => {
        const [idMatr, fuEmpr, apData] = key.split('|');
        
        // Calculate App Minutes
        let appMinutes = 0;
        const myAppRecs = appRecords.filter(r => 
            r.id_matr == idMatr && r.fu_empr == fuEmpr && r.ap_data == apData
        );
        myAppRecs.forEach(r => appMinutes += calculateMinutesFromRecord(r));

        // Calculate Secullum Minutes
        let secuMinutes = 0;
        const mySecuRecs = secuRecords.filter(r => 
            r.id_matr == idMatr && r.fu_empr == fuEmpr && r.ap_data == apData
        );
        mySecuRecs.forEach(r => secuMinutes += calculateMinutesFromRecord(r));

        const diff = Math.abs(appMinutes - secuMinutes);
        const firstRec = myAppRecs[0] || mySecuRecs[0];
        if (!firstRec) return;

        // Threshold logic from legacy (15 min normally, 20 min for client 69)
        const threshold = firstRec.id_clie === 69 ? 20 : 15;

        if (diff > threshold) {
            // Status Filter logic
            if (statusFilter && statusFilter > 0 && firstRec.id_strc !== statusFilter) return;
            // If statusFilter < 0 (No App Appointment), check if appMinutes == 0
            if (statusFilter && statusFilter < 0 && appMinutes > 0) return;

            divergences.push({
                id_matr: parseInt(idMatr),
                fu_empr: fuEmpr,
                ap_data: apData,
                fu_nome: firstRec.fu_nome,
                em_fant: firstRec.em_fant,
                id_clie: firstRec.id_clie,
                cl_fant: firstRec.cl_fant,
                ap_mnap: appMinutes,
                ap_mnse: secuMinutes,
                id_strc: firstRec.id_strc
            });
        }
    });

    return divergences;
}
