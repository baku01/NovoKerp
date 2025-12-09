import { callProcedure, createParam } from '../../api/procedures';
import { format } from 'date-fns';

export interface ActivityReport {
    id_ords: number;
    os_nume: string;
    id_ativ: number;
    id_excl?: number;
    at_deno: string;
    at_tipo: string;
    ap_dres?: number;
    ap_hent?: number;
    ap_hter?: number;
    ap_real?: string;
}

export interface ActivityComment {
    cm_desc: string;
    cm_user: string;
    cm_data: string;
}

export interface ActivityResource {
    id_matr: number;
    fu_nome: string;
    fu_func: string;
    ap_data: string;
    ap_hent?: number;
    ap_hter?: number;
}

export async function fetchActivityReport(
    empresa: string,
    worksiteId: number,
    orderId: number,
    date: Date
) {
    const params = [
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnIdClie', 'Int', worksiteId),
        createParam('lnIdOrds', 'Int', orderId),
        createParam('ldApData', 'SmallDatetime', format(date, 'yyyy-MM-dd')),
    ];
    return callProcedure<ActivityReport>('pesquisaRelatorioAtividades', params);
}

export async function fetchActivityResources(
    empresa: string,
    worksiteId: number,
    orderId: number,
    date: Date
) {
    const params = [
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnIdClie', 'Int', worksiteId),
        createParam('lnIdOrds', 'Int', orderId),
        createParam('ldApData', 'SmallDatetime', format(date, 'yyyy-MM-dd')),
    ];
    return callProcedure<ActivityResource>('pesquisaRecursosDiaAtividade', params);
}

export async function fetchActivityComments(
    empresa: string,
    worksiteId: number,
    orderId: number,
    date: Date
) {
    const params = [
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnIdClie', 'Int', worksiteId),
        createParam('lnIdOrds', 'Int', orderId),
        createParam('ldApData', 'SmallDatetime', format(date, 'yyyy-MM-dd')),
    ];
    return callProcedure<ActivityComment>('pesquisaComentariosOrdensServico', params);
}

export async function updateRemainingDaysActivity(
    empresa: string,
    orderId: number,
    exclusionId: number,
    activityId: number,
    remainingDays: number
) {
    const params = [
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnIdOrds', 'Int', orderId),
        createParam('lnIdExcl', 'Int', exclusionId),
        createParam('lnIdAtiv', 'Int', activityId),
        createParam('lnApDres', 'Decimal', remainingDays),
    ];
    return callProcedure('atualizaDiasRestantesAtividade', params);
}

export async function inactivateTask(
    empresa: string,
    orderId: number,
    exclusionId: number
) {
    const params = [
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnIdOrds', 'Int', orderId),
        createParam('lnIdExcl', 'Int', exclusionId),
    ];
    return callProcedure('atualizaInativaTarefa', params);
}
