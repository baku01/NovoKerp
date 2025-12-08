import { callProcedure, createParam } from '../../api/procedures';
import { StatusOption, DivergenceFilters } from './types';
import { format } from 'date-fns';

export async function fetchDivergences(
    empresa: string,
    filters: DivergenceFilters
): Promise<unknown[]> {
    // Legacy uses `pesquisaApontamentosAplicativoSecullumPeriodo`
    // It returns ALL records, and filtering is done client-side in legacy `ComlApDvrg.js`.
    // `lmWkRsql` returns records with `ap_tipo` ('A' for App, 'S' for Secullum).
    // Then it calculates minutes and compares.
    // This logic is complex.
    // However, if the procedure supports returning divergences directly, that would be better.
    // Looking at legacy, `pesquisaApontamentosAplicativoSecullumPeriodo` takes params.
    // It seems it returns raw data and client does the math.
    // "lnApMnap += calculaMinutosCAD..."
    // "if ((Math.abs(lnApMnse - lnApMnap) > 15..."
    
    // We need to replicate this logic in the frontend or service.
    // I'll fetch the raw data and process it in the hook or service.
    // Actually, the procedure returns `ap_tipo`.
    
    const params = [
        createParam('lcIdUser', 'VarChar', '0'),
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('ldApDtde', 'SmallDatetime', filters.startDate ? format(filters.startDate, 'yyyy-MM-dd') : null),
        createParam('ldApDtat', 'SmallDatetime', filters.endDate ? format(filters.endDate, 'yyyy-MM-dd') : null),
        createParam('lnIdClie', 'Int', filters.worksiteId),
        createParam('lnIdMatr', 'Int', filters.employeeId),
        createParam('lcFuNome', 'VarChar', filters.employeeName),
    ];
    
    // The legacy procedure returns a flat list of "App" and "Secullum" records.
    // We need to process this.
    // I'll define a raw type for the procedure result.
    return callProcedure<unknown>('pesquisaApontamentosAplicativoSecullumPeriodo', params);
}

export async function fetchDivergenceWorksites(
    empresa: string,
    startDate: Date,
    endDate: Date
): Promise<{ id_clie: number, cl_fant: string }[]> {
    const params = [
        createParam('lcIdUser', 'VarChar', '0'),
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('ldDrDtde', 'SmallDatetime', format(startDate, 'yyyy-MM-dd')),
        createParam('ldDrDtat', 'SmallDatetime', format(endDate, 'yyyy-MM-dd')),
    ];
    return callProcedure('pesquisaObrasDefinidasPorPeriodo', params);
}

export async function fetchStatusOptions(
    empresa: string,
    worksiteId: number | null,
    startDate: Date,
    endDate: Date
): Promise<StatusOption[]> {
    const params = [
        createParam('lcIdUser', 'VarChar', '0'),
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnIdClie', 'Int', worksiteId),
        createParam('ldApDtde', 'SmallDatetime', format(startDate, 'yyyy-MM-dd')),
        createParam('ldApDtat', 'SmallDatetime', format(endDate, 'yyyy-MM-dd')),
    ];
    return callProcedure('pesquisaStatusFuncionarios', params);
}
