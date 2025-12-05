import { callProcedure, createParam } from '../../api/procedures';
import { StockReturn, StockTransferRequest, StockWorksite, StockStatusOption, StockFilters } from './types';
import { format } from 'date-fns';

export async function fetchStockReturns(
    empresa: string,
    filters: StockFilters
): Promise<StockReturn[]> {
    const params = [
        createParam('lcIdUser', 'VarChar', '0'),
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('ldDlDtde', 'SmallDatetime', filters.startDate ? format(filters.startDate, 'yyyy-MM-dd') : null),
        createParam('ldDlDtat', 'SmallDatetime', filters.endDate ? format(filters.endDate, 'yyyy-MM-dd') : null),
        createParam('lnIdSitu', 'Int', filters.statusId),
        createParam('lnIdClie', 'Int', filters.worksiteId),
    ];
    return callProcedure<StockReturn>('pesquisaDevolucoesEstoque', params);
}

export async function fetchStockTransfers(
    empresa: string,
    filters: StockFilters
): Promise<StockTransferRequest[]> {
    const params = [
        createParam('lcIdUser', 'VarChar', '0'),
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('ldSlDtde', 'SmallDatetime', filters.startDate ? format(filters.startDate, 'yyyy-MM-dd') : null),
        createParam('ldSlDtat', 'SmallDatetime', filters.endDate ? format(filters.endDate, 'yyyy-MM-dd') : null),
        createParam('lnIdSitu', 'Int', filters.statusId),
        createParam('lnIdClie', 'Int', filters.worksiteId),
    ];
    return callProcedure<StockTransferRequest>('pesquisaSolicitacoesTransferencia', params);
}

export async function fetchStockWorksites(
    empresa: string,
    startDate: Date | null,
    endDate: Date | null
): Promise<StockWorksite[]> {
    const params = [
        createParam('lcIdUser', 'VarChar', '0'),
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('ldDrDtde', 'SmallDatetime', startDate ? format(startDate, 'yyyy-MM-dd') : null),
        createParam('ldDrDtat', 'SmallDatetime', endDate ? format(endDate, 'yyyy-MM-dd') : null),
    ];
    // Using `pesquisaObrasDefinidasPeriodo` or `pesquisaObrasDefinidas` depending on legacy context.
    // `CestDeLcto.js` uses `pesquisaObrasDefinidasPeriodo`.
    // `CestStLcto.js` uses `pesquisaObrasDefinidas` (without dates).
    // I'll implement `fetchStockWorksitesPeriod` and `fetchStockWorksitesAll` or reuse this.
    // Let's use `pesquisaObrasDefinidas` if dates are null, but that expects just ONE date usually?
    // Actually `pesquisaObrasDefinidas` takes `ldDrData` (single date).
    // `pesquisaObrasDefinidasPeriodo` takes start/end.
    // I'll assume period based fetching for the list filters.
    
    if (startDate && endDate) {
        return callProcedure<StockWorksite>('pesquisaObrasDefinidasPeriodo', params);
    } else {
        // Fallback or specialized call if needed
        return []; 
    }
}

export async function fetchStockWorksitesSingleDate(
    empresa: string
): Promise<StockWorksite[]> {
    const params = [
        createParam('lcIdUser', 'VarChar', '0'),
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('ldDrData', 'SmallDatetime', '1900-01-01'), // Legacy `CestStLcto` passes 1900-01-01
    ];
    return callProcedure<StockWorksite>('pesquisaObrasDefinidas', params);
}

export async function fetchStockStatuses(
    empresa: string,
    type: 'TRANSFER' | 'RETURN'
): Promise<StockStatusOption[]> {
    const params = [
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnStTrnf', 'Int', type === 'TRANSFER' ? 1 : null),
        createParam('lnStDevl', 'Int', type === 'RETURN' ? 1 : null),
    ];
    return callProcedure<StockStatusOption>('pesquisaSituacoes', params);
}
