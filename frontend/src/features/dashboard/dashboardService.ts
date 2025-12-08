import { callProcedure, createParam } from '../../api/procedures';

export interface DashboardObra {
    id_clie: number;
    id_cadt: number;
    cl_fant: string;
    cl_pavc: number; // % avanço
    cl_papl: number; // % avanço planejado
    cl_dant: number; // desvio anterior
    cl_dsac: string; // data avanço
    cl_dtpt: string; // data prevista término
    cl_dttr: string; // data término atualização
    cl_dttp: string; // data término planejado
    cl_enca: string; // encarregado
    cl_plan: string; // planejador
    cl_paft: number; // % a faturar
    cl_qrdo: number; // quantidade RDO
    cl_qaro: number; // quantidade aprovada RDO
    qt_modi: number; // quantidade modificações
    qt_moda: number; // quantidade modificações atualização
    ap_data: string; // última data apontamento
    oc_qthr: number; // horas orçadas
    os_phcn: number; // horas planejadas (orçadas p/ planejamento)
    re_hrap: number; // horas realizadas (recursos apontados)
    re_htap: number; // horas trabalhadas (recursos apontados)
}

export interface ApontamentoDivergente {
    id_cadt: number;
    qt_dvrg: number;
}

export interface ApontamentoPendente {
    id_cadt: number;
    qt_pndt: number;
    qt_tota: number;
}

export interface HourPremium {
    id_clie: number;
    ah_hora: number; // Hours in decimal format (e.g., 8.5 for 8h30m)
}

/**
 * Fetch dashboard data for obras (construction sites)
 */
export async function fetchDashboardObras(
    userId: string,
    empresa: string,
    data: string
): Promise<DashboardObra[]> {
    const params = [
        createParam('lcIdUser', 'VarChar', userId),
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('ldCaData', 'SmallDatetime', data),
    ];

    return callProcedure<DashboardObra>('pesquisaDashboardObras', params);
}

/**
 * Fetch divergent appointments
 */
export async function fetchApontamentosDivergentes(
    userId: string,
    empresa: string,
    data: string
): Promise<ApontamentoDivergente[]> {
    const params = [
        createParam('lcIdUser', 'VarChar', userId),
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('ldCaData', 'SmallDatetime', data),
    ];

    return callProcedure<ApontamentoDivergente>(
        'pesquisaDashboardApontamentosDivergentes',
        params
    );
}

/**
 * Fetch pending appointments
 */
export async function fetchApontamentosPendentes(
    userId: string,
    empresa: string,
    data: string
): Promise<ApontamentoPendente[]> {
    const params = [
        createParam('lcIdUser', 'VarChar', userId),
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('ldCaData', 'SmallDatetime', data),
    ];

    return callProcedure<ApontamentoPendente>(
        'pesquisaDashboardApontamentosPendentes',
        params
    );
}

/**
 * Fetch hour premium data
 */
export async function fetchHorasPremio(
    empresa: string,
    data: string
): Promise<HourPremium[]> {
    const params = [
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnIdClie', 'Int', null), // Null for all clients
        createParam('ldAhData', 'SmallDatetime', data),
    ];
    return callProcedure<HourPremium>('pesquisaHorasPremio', params);
}
