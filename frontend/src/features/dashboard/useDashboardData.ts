import { useQuery } from '@tanstack/react-query';
import { useUserStore } from '../../stores/useUserStore';
import { format } from 'date-fns';
import { useMemo } from 'react'; // Import useMemo
import {
    fetchDashboardObras,
    fetchApontamentosDivergentes,
    fetchApontamentosPendentes,
    fetchHorasPremio
} from './dashboardService';

export function useDashboardData(date: Date = new Date()) {
    const user = useUserStore((state) => state.user);
    const empresa = useUserStore((state) => state.empresa);

    const formattedDate = format(date, 'yyyy-MM-dd');

    const enabled = !!user && !!empresa;

    const obrasQuery = useQuery({
        queryKey: ['dashboard', 'obras', empresa, formattedDate],
        queryFn: () => fetchDashboardObras(user?.id_user || '', empresa, formattedDate),
        enabled,
    });

    const divergentesQuery = useQuery({
        queryKey: ['dashboard', 'divergentes', empresa, formattedDate],
        queryFn: () => fetchApontamentosDivergentes(user?.id_user || '', empresa, formattedDate),
        enabled,
    });

    const pendentesQuery = useQuery({
        queryKey: ['dashboard', 'pendentes', empresa, formattedDate],
        queryFn: () => fetchApontamentosPendentes(user?.id_user || '', empresa, formattedDate),
        enabled,
    });

    const horasPremioQuery = useQuery({
        queryKey: ['dashboard', 'horasPremio', empresa, formattedDate],
        queryFn: () => fetchHorasPremio(empresa, formattedDate),
        enabled,
    });

    const aggregatedData = useMemo(() => {
        if (!obrasQuery.data || !divergentesQuery.data || !pendentesQuery.data || !horasPremioQuery.data) {
            return {
                totalHorasOrcadas: 0,
                totalHorasPlanejadas: 0,
                totalAptDivergentes: 0,
                totalAptPendentes: 0,
                totalAptTotal: 0,
                totalRdoPendente: 0,
                totalRdoTotal: 0,
                totalModificacoes: 0,
                totalModAtualizacao: 0,
                percHorasTotaisConsumidas: 0,
                percHorasTrabalhadas: 0,
                horasPremioMinutos: 0
            };
        }

        const obras = obrasQuery.data;
        const divergentes = divergentesQuery.data;
        const pendentes = pendentesQuery.data;
        const horasPremio = horasPremioQuery.data;

        let totalHorasOrcadas = 0;
        let totalHorasPlanejadas = 0; // os_phcn is Planned by current method name.
        let totalAptDivergentes = 0;
        let totalAptPendentes = 0;
        let totalAptTotal = 0;
        let totalRdoPendente = 0;
        let totalRdoTotal = 0;
        let totalModificacoes = 0;
        let totalModAtualizacao = 0;
        let horasPremioMinutos = 0;

        for (const obra of obras) {
            totalHorasOrcadas += obra.oc_qthr; // Assuming oc_qthr is 'Horas Orçadas' for the total
            totalHorasPlanejadas += obra.os_phcn; // Assuming os_phcn is 'Horas Plan' for the total
            totalRdoPendente += obra.cl_qrdo - obra.cl_qaro;
            totalRdoTotal += obra.cl_qrdo;
            totalModificacoes += obra.qt_modi;
            totalModAtualizacao += obra.qt_moda;

            const div = divergentes.find(d => d.id_cadt === obra.id_cadt);
            if (div) totalAptDivergentes += div.qt_dvrg;

            const pend = pendentes.find(p => p.id_cadt === obra.id_cadt);
            if (pend) {
                totalAptPendentes += pend.qt_pndt;
                totalAptTotal += pend.qt_tota;
            }
        }

        for (const hp of horasPremio) {
            // ah_hora is decimal (e.g., 8.5 for 8h30m)
            horasPremioMinutos += Math.floor(hp.ah_hora) * 60 + Math.round((hp.ah_hora % 1) * 100);
        }

        // Calculate gauge percentages
        const totalRealizadasHorasTotais = obras.reduce((sum, obra) => sum + obra.re_hrap, 0) + Math.floor(horasPremioMinutos / 60);
        const totalTrabalhadasHorasTotais = obras.reduce((sum, obra) => sum + obra.re_htap, 0) + Math.floor(horasPremioMinutos / 60);

        const percHorasTotaisConsumidas = totalHorasOrcadas > 0 ? (totalRealizadasHorasTotais / totalHorasOrcadas) * 100 : 0;
        const percHorasTrabalhadas = totalHorasPlanejadas > 0 ? (totalTrabalhadasHorasTotais / totalHorasPlanejadas) * 100 : 0;
        
        return {
            totalHorasOrcadas,
            totalHorasPlanejadas,
            totalAptDivergentes,
            totalAptPendentes,
            totalAptTotal,
            totalRdoPendente,
            totalRdoTotal,
            totalModificacoes,
            totalModAtualizacao,
            percHorasTotaisConsumidas,
            percHorasTrabalhadas,
            horasPremioMinutos
        };
    }, [obrasQuery.data, divergentesQuery.data, pendentesQuery.data, horasPremioQuery.data]);


    return {
        obras: obrasQuery.data || [],
        divergentes: divergentesQuery.data || [],
        pendentes: pendentesQuery.data || [],
        aggregatedData,
        isLoading: obrasQuery.isLoading || divergentesQuery.isLoading || pendentesQuery.isLoading || horasPremioQuery.isLoading,
        error: obrasQuery.error || divergentesQuery.error || pendentesQuery.error || horasPremioQuery.error,
    };
}
