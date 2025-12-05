import { callProcedure, createParam } from '../../api/procedures';

export interface ServiceOrderSummary {
    id_clie: number;
    id_ords: number;
    os_nume: string;
    cl_fant: string;
    os_qrdo: number; // Qtd RDO
    os_qaro: number; // Qtd Aprovado RDO
    os_pcon: number; // % Conclusão
    ap_data: string; // Data Apontamento
    re_hrap: number; // Realizado Horas Apontadas
    re_htap: number; // Realizado Horas Trabalhadas
    
    // Budgeted/Planned fields
    oc_qthr: number; // Orçadas
    os_mdpl: number; // Planejadas Mão de Obra
    pl_qthr: number; // Total Planejadas (Alternative)
}

export interface WorksiteSummaryUpdate {
    cl_dant: number; // Desvio Anterior
    cl_pavc: number; // Progresso %
    cl_dsac: string; // Data
    cl_papl: number; // Progresso Planejado %
    qt_moda: number; // Modificações Atualização
    cl_dtpt: string; // Data Prevista Término
    cl_dttr: string; // Data Término Real
    cl_dttp: string; // Data Término Planejado
    cl_enca: string; // Encarregado
    cl_plan: string; // Planejador
    cl_paft: number; // % A Faturar
}

export interface PremiumHoursSummary {
    id_hrpr: number;
    id_clie: number;
    ah_data: string; // Date
    ah_hora: number; // Decimal time
    ah_desc: string;
    id_user: string;
}

export async function fetchServiceOrders(
    empresa: string,
    idClie: number,
    date: string
): Promise<ServiceOrderSummary[]> {
    const params = [
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnIdClie', 'Int', idClie),
        createParam('ldCaData', 'SmallDatetime', date),
    ];
    return callProcedure<ServiceOrderSummary>('pesquisaDashboardPropostas', params);
}

export async function fetchWorksiteSummaryUpdate(
    empresa: string,
    idClie: number,
    date: string
): Promise<WorksiteSummaryUpdate[]> {
    const params = [
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnIdClie', 'Int', idClie),
        createParam('lnClDant', 'Decimal', 0),
        createParam('lnClPavc', 'Decimal', 0),
        createParam('ldClDsac', 'SmallDatetime', '1900-01-01'),
        createParam('lnClPapl', 'Decimal', 0),
        createParam('lnClModp', 'Decimal', 0),
        createParam('ldClDtpt', 'SmallDatetime', '1900-01-01'),
        createParam('ldClDttr', 'SmallDatetime', '1900-01-01'),
        createParam('ldClDttp', 'SmallDatetime', '1900-01-01'),
        createParam('lcClEnca', 'VarChar', ''),
        createParam('lcClPlan', 'VarChar', ''),
        createParam('lnClPaft', 'Decimal', 0),
        createParam('ldCaData', 'SmallDatetime', date),
    ];
    return callProcedure<WorksiteSummaryUpdate>('atualizaInformacoesDashboardObra', params);
}

export async function fetchPremiumHours(
    empresa: string,
    idClie: number,
    date: string
): Promise<PremiumHoursSummary[]> {
    const params = [
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnIdClie', 'Int', idClie),
        createParam('ldAhData', 'SmallDatetime', date),
    ];
    return callProcedure<PremiumHoursSummary>('pesquisaHorasPremio', params);
}