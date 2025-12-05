import { callProcedure, createParam } from '../../api/procedures';
import { StockTransfer, StockReturn, TransferStatus, TransferFilters } from './types';
import { Worksite } from '../stock-position/types';
import { format } from 'date-fns';

export async function fetchStockTransfers(
    empresa: string,
    filters: TransferFilters
): Promise<StockTransfer[]> {
    const params = [
        createParam('lcIdUser', 'VarChar', '0'),
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('ldSlDtde', 'SmallDatetime', format(filters.startDate, 'yyyy-MM-dd')),
        createParam('ldSlDtat', 'SmallDatetime', format(filters.endDate, 'yyyy-MM-dd')),
        createParam('lnIdSitu', 'Int', filters.statusId || null),
        createParam('lnIdClie', 'Int', filters.worksiteId || null),
    ];
    return callProcedure<StockTransfer>('pesquisaSolicitacoesTransferencia', params);
}

export async function fetchStockReturns(
    empresa: string,
    filters: TransferFilters
): Promise<StockReturn[]> {
    const params = [
        createParam('lcIdUser', 'VarChar', '0'),
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('ldDlDtde', 'SmallDatetime', format(filters.startDate, 'yyyy-MM-dd')),
        createParam('ldDlDtat', 'SmallDatetime', format(filters.endDate, 'yyyy-MM-dd')),
        createParam('lnIdSitu', 'Int', filters.statusId || null),
        createParam('lnIdClie', 'Int', filters.worksiteId || null),
    ];
    return callProcedure<StockReturn>('pesquisaDevolucoesEstoque', params);
}

export async function fetchTransferStatuses(empresa: string, mode: 'TRANSFER' | 'RETURN'): Promise<TransferStatus[]> {
    const params = [
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnStTrnf', 'Int', mode === 'TRANSFER' ? 1 : null),
        createParam('lnStDevl', 'Int', mode === 'RETURN' ? 1 : null),
    ];
    return callProcedure<TransferStatus>('pesquisaSituacoes', params);
}

export async function fetchTransferWorksites(empresa: string): Promise<Worksite[]> {
    // Legacy `pesquisaObrasDefinidas` with "REAL" check is UI logic, procedure returns all usually.
    const params = [
        createParam('lcIdUser', 'VarChar', '0'),
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('ldDrData', 'SmallDatetime', '1900-01-01'), // All time?
    ];
    return callProcedure<Worksite>('pesquisaObrasDefinidas', params);
}
