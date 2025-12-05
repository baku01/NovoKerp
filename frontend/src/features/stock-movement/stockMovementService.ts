import { callProcedure, createParam } from '../../api/procedures';
import { StockMovement, StockMovementFilter } from './types';
import { format } from 'date-fns';

export async function fetchStockMovements(
    empresa: string,
    filters: StockMovementFilter
): Promise<StockMovement[]> {
    const params = [
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnIdClie', 'Int', filters.worksiteId),
        createParam('ldMvDtde', 'SmallDatetime', filters.startDate ? format(filters.startDate, 'yyyy-MM-dd') : null),
        createParam('ldMvDtat', 'SmallDatetime', filters.endDate ? format(filters.endDate, 'yyyy-MM-dd') : null),
        createParam('lcMvTpme', 'VarChar', filters.type === 'T' ? null : filters.type),
        createParam('lcMvPesq', 'VarChar', filters.searchType),
        createParam('lcFuEmpr', 'VarChar', null), // Filtered by UI selection logic usually
        createParam('lcIdMatr', 'VarChar', null), // "123|456"
        createParam('lcIdOrds', 'VarChar', null), // "10|11"
    ];
    
    // Note: Legacy passes concatenated IDs in `lcIdMatr` / `lcIdOrds`.
    // We should probably handle that if we implement the multi-select filter.
    // For now, passing null returns all or we can enhance this service method.
    
    return callProcedure<StockMovement>('pesquisaMovimentacoesEstoque', params);
}

export async function fetchStockMovementDetails(
    empresa: string,
    docNum: number,
    type: string
): Promise<StockMovement[]> {
    const params = [
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnIdFili', 'Int', 1), // Hardcoded 1 in legacy
        createParam('lnMvDocu', 'Int', docNum),
        createParam('lcMvTpme', 'VarChar', type),
    ];
    return callProcedure<StockMovement>('pesquisaMovimentacaoEstoque', params);
}

export async function saveStockMovement(
    userId: string,
    empresa: string,
    movement: any // Define payload structure
): Promise<any[]> {
    // Legacy: `atualizaMovimentacaoEstoque` update header?
    // or `insereMovimentacaoEstoque`? (Not visible in snippet but implied for creation)
    // The snippet `CestMvMvto.js` has `atualizaMovimentacaoEstoque` which updates Observation.
    
    const params = [
        createParam('lcIdUser', 'VarChar', userId),
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnIdFili', 'Int', 1),
        createParam('lnMvDocu', 'Int', movement.docNum),
        createParam('lcMvTpme', 'VarChar', movement.type),
        createParam('lcMvObse', 'VarChar', movement.observation),
    ];
    return callProcedure('atualizaMovimentacaoEstoque', params);
}
