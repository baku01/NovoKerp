import { callProcedure, createParam } from '../../api/procedures';

export interface ServiceOrderPlannedActual {
    os_mdpl?: number; // Mão de obra planejada
    os_mipl?: number; // Montagem/instalação planejada
    os_eqpl?: number; // Equipamento planejado
    fu_hamd?: number; // Horas apontadas mão de obra
    fu_hami?: number; // Horas apontadas montagem/instalação
    eq_hrap?: number; // Horas apontadas equipamentos
    mp_qthr?: number; // Horas orçadas mão de obra
    mi_qthr?: number; // Horas orçadas montagem/instalação
    eq_qthr?: number; // Horas orçadas equipamentos
    [key: string]: string | number | undefined;
}

export interface ServiceOrderSituation {
    sr_deno: string; // Situação/descrição
    re_hrap: number; // Horas apontadas
}

export interface ServiceOrderDashboardDetail {
    cl_fant: string;
    os_nume: string;
    os_tipo: number;
    os_resp: string;
    oc_nume: string;
    os_ncli: string;
    os_ncon: string;
    os_desc: string;
    os_situ: string;
    re_hrap?: number;
    oc_qthr?: number;
    os_phcn?: number;
    os_pcon?: number;
    [key: string]: string | number | null | undefined;
}

export async function fetchPlannedActualHours(
    empresa: string,
    worksiteId: number,
    orderId: number,
    date: string
): Promise<ServiceOrderPlannedActual[]> {
    const params = [
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnIdCadt', 'Int', worksiteId),
        createParam('lnIdOrds', 'Int', orderId),
        createParam('ldCaData', 'SmallDatetime', date),
    ];

    return callProcedure<ServiceOrderPlannedActual>('pesquisaDashboardHorasPlanejadasApontadas', params);
}

export async function fetchAppointmentSituations(
    empresa: string,
    worksiteId: number,
    orderId: number,
    date: string
): Promise<ServiceOrderSituation[]> {
    const params = [
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnIdCadt', 'Int', worksiteId),
        createParam('lnIdOrds', 'Int', orderId),
        createParam('ldCaData', 'SmallDatetime', date),
    ];

    return callProcedure<ServiceOrderSituation>('pesquisaDashboardApontamentoSituacao', params);
}

export async function fetchServiceOrderDashboardDetail(
    empresa: string,
    worksiteId: number,
    orderId: number,
    date: string
): Promise<ServiceOrderDashboardDetail[]> {
    const params = [
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnIdClie', 'Int', worksiteId),
        createParam('lnIdOrds', 'Int', orderId),
        createParam('ldCaData', 'SmallDatetime', date),
    ];

    return callProcedure<ServiceOrderDashboardDetail>('consultaDashboardProposta', params);
}
