import { callProcedure, createParam } from '../../api/procedures';
import { StockPosition, StockPositionFilters, Worksite, ServiceOrder, EmployeeCandidate } from './types';
import { format } from 'date-fns';

export async function fetchStockPosition(
    empresa: string,
    filters: StockPositionFilters
): Promise<StockPosition[]> {
    const isUsage = filters.type === 'U';
    const procName = isUsage ? 'pesquisaConsumoEstoque' : 'pesquisaPosicaoEstoque';

    // Legacy mapping:
    // U: lcIdEmpr, lnIdClie, ldMvDtde, ldMvDtat, lnIdOrds, lcFuEmpr, lnIdMatr
    // A: lcIdEmpr, lnIdClie, ldMvData, lcFuEmpr, lnIdMatr

    const params = [
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnIdClie', 'Int', filters.worksiteId)
    ];

    if (isUsage) {
        params.push(createParam('ldMvDtde', 'SmallDatetime', filters.startDate ? format(filters.startDate, 'yyyy-MM-dd') : null));
        params.push(createParam('ldMvDtat', 'SmallDatetime', filters.endDate ? format(filters.endDate, 'yyyy-MM-dd') : null));
        params.push(createParam('lnIdOrds', 'Int', filters.serviceOrderId || 0));
        // Need to extract empresa from employee ID if needed, or pass separately.
        // Legacy passes `lcFuEmpr` and `lnIdMatr`.
        // We will assume `employeeId` is just the ID, we might need the company code.
        // For now, let's pass null for `lcFuEmpr` if we don't have it easily, or fetch it.
        // Actually, `pesquisaConsumoEstoque` takes `lcFuEmpr`.
        // We should probably include it in filters or derive it.
        // Let's assume passed filters might have it.
        params.push(createParam('lcFuEmpr', 'VarChar', filters.employeeCompany || null));
        params.push(createParam('lnIdMatr', 'Int', filters.employeeId || 0));
    } else {
        params.push(createParam('ldMvData', 'SmallDatetime', filters.date ? format(filters.date, 'yyyy-MM-dd') : null));
        params.push(createParam('lcFuEmpr', 'VarChar', null));
        params.push(createParam('lnIdMatr', 'Int', filters.employeeId || 0));
    }

    return callProcedure<StockPosition>(procName, params);
}

export async function fetchWorksites(
    empresa: string,
    filters: Partial<StockPositionFilters>
): Promise<Worksite[]> {
    const isUsage = filters.type === 'U';
    const procName = isUsage ? 'pesquisaObrasDefinidasPorPeriodo' : 'pesquisaObrasDefinidas';

    const params = [
        createParam('lcIdUser', 'VarChar', '0'), // User ID
        createParam('lcIdEmpr', 'VarChar', empresa),
    ];

    if (isUsage) {
        params.push(createParam('ldDrDtde', 'SmallDatetime', filters.startDate ? format(filters.startDate, 'yyyy-MM-dd') : null));
        params.push(createParam('ldDrDtat', 'SmallDatetime', filters.endDate ? format(filters.endDate, 'yyyy-MM-dd') : null));
    } else {
        params.push(createParam('ldDrData', 'SmallDatetime', filters.date ? format(filters.date, 'yyyy-MM-dd') : null));
    }

    return callProcedure<Worksite>(procName, params);
}

export async function fetchServiceOrders(
    empresa: string,
    worksiteId: number
): Promise<ServiceOrder[]> {
    const params = [
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnIdCadt', 'Int', worksiteId), // Note: Worksites usually return id_cadt for this
        createParam('lcOsNume', 'VarChar', null),
        createParam('lcOsResp', 'VarChar', null),
        createParam('lcOsDesc', 'VarChar', null),
        createParam('lcOsNcli', 'VarChar', null),
        createParam('lcOsNcon', 'VarChar', null),
    ];
    return callProcedure<ServiceOrder>('pesquisaPropostas', params);
}

export async function fetchEmployees(
    empresa: string,
    worksiteId: number,
    filters: { date?: Date, startDate?: Date, endDate?: Date, type: 'U' | 'A' }
): Promise<EmployeeCandidate[]> {
    const isUsage = filters.type === 'U';
    const procName = isUsage ? 'pesquisaFuncionariosPorPeriodoEMovimentacao' : 'pesquisaFuncionarios';

    const params = [createParam('lcIdEmpr', 'VarChar', empresa)];

    if (isUsage) {
        params.push(createParam('lnIdCadt', 'Int', worksiteId));
        params.push(createParam('ldDrDtde', 'SmallDatetime', filters.startDate ? format(filters.startDate, 'yyyy-MM-dd') : null));
        params.push(createParam('ldDrDtat', 'SmallDatetime', filters.endDate ? format(filters.endDate, 'yyyy-MM-dd') : null));
    } else {
        params.push(createParam('ldDrData', 'SmallDatetime', filters.date ? format(filters.date, 'yyyy-MM-dd') : null));
        params.push(createParam('lnIdCadt', 'Int', worksiteId));
        params.push(createParam('lnIdMatr', 'Int', null));
        params.push(createParam('lcFuEmpr', 'VarChar', null));
        params.push(createParam('lcFuNome', 'VarChar', null));
    }

    return callProcedure<EmployeeCandidate>(procName, params);
}
