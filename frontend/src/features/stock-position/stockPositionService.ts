import { callProcedure, createParam } from '../../api/procedures';
import { StockItem, StockPositionFilters, StockEmployee, StockOrder } from './types';
import { format } from 'date-fns';

export async function fetchStockPosition(
    empresa: string,
    filters: StockPositionFilters
): Promise<StockItem[]> {
    if (filters.mode === 'POSITION') {
        const params = [
            createParam('lcIdEmpr', 'VarChar', empresa),
            createParam('lnIdClie', 'Int', filters.worksiteId),
            createParam('ldMvData', 'SmallDatetime', filters.date ? format(filters.date, 'yyyy-MM-dd') : null),
            createParam('lcFuEmpr', 'VarChar', filters.employeeCompany || null),
            createParam('lnIdMatr', 'Int', filters.employeeId || null),
        ];
        // Add missing 'ce_tipo' to result manually if needed, or backend returns it?
        // Legacy `pesquisaPosicaoEstoque` returns data. 
        // We need to ensure `ce_tipo` is present or we default it. 
        // Actually legacy `CestPsEstq.js` logic depends on `ce_tipo` ('U' vs 'A'). 
        // If fetching Position ('A'), items might have `ce_tipo` = 'A'?
        return callProcedure<StockItem>('pesquisaPosicaoEstoque', params);
    } else {
        const params = [
            createParam('lcIdEmpr', 'VarChar', empresa),
            createParam('lnIdClie', 'Int', filters.worksiteId),
            createParam('ldMvDtde', 'SmallDatetime', filters.startDate ? format(filters.startDate, 'yyyy-MM-dd') : null),
            createParam('ldMvDtat', 'SmallDatetime', filters.endDate ? format(filters.endDate, 'yyyy-MM-dd') : null),
            createParam('lnIdOrds', 'Int', filters.orderId || null),
            createParam('lcFuEmpr', 'VarChar', filters.employeeCompany || null),
            createParam('lnIdMatr', 'Int', filters.employeeId || null),
        ];
        return callProcedure<StockItem>('pesquisaConsumoEstoque', params);
    }
}

export async function fetchStockEmployees(
    empresa: string,
    worksiteId: number,
    filters: StockPositionFilters
): Promise<StockEmployee[]> {
    let params;
    let procName = '';

    if (filters.mode === 'CONSUMPTION') {
        procName = 'pesquisaFuncionariosPorPeriodoEMovimentacao';
        params = [
            createParam('lcIdEmpr', 'VarChar', empresa),
            createParam('lnIdCadt', 'Int', worksiteId),
            createParam('ldDrDtde', 'SmallDatetime', filters.startDate ? format(filters.startDate, 'yyyy-MM-dd') : null),
            createParam('ldDrDtat', 'SmallDatetime', filters.endDate ? format(filters.endDate, 'yyyy-MM-dd') : null),
        ];
    } else {
        procName = 'pesquisaFuncionarios';
        params = [
            createParam('lcIdEmpr', 'VarChar', empresa),
            createParam('ldDrData', 'SmallDatetime', filters.date ? format(filters.date, 'yyyy-MM-dd') : null),
            createParam('lnIdCadt', 'Int', worksiteId),
            createParam('lnIdMatr', 'Int', null),
            createParam('lcFuEmpr', 'VarChar', null),
            createParam('lcFuNome', 'VarChar', null),
        ];
    }
    
    return callProcedure<StockEmployee>(procName, params);
}

export async function fetchStockOrders(
    empresa: string,
    worksiteId: number
): Promise<StockOrder[]> {
    const params = [
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnIdCadt', 'Int', worksiteId),
        createParam('lcOsNume', 'VarChar', null),
        createParam('lcOsResp', 'VarChar', null),
        createParam('lcOsDesc', 'VarChar', null),
        createParam('lcOsNcli', 'VarChar', null),
        createParam('lcOsNcon', 'VarChar', null),
    ];
    return callProcedure<StockOrder>('pesquisaPropostas', params);
}
