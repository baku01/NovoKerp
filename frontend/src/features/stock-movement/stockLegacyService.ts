import { callProcedure, createParam } from '../../api/procedures';

export interface StockBalance {
    id_cest: number;
    ce_desc: string;
    ce_unes: string;
    saldo: number;
    saldo_empenhado?: number;
}

export interface StockMovementRecord {
    id_cest: number;
    ce_desc: string;
    mv_data: string;
    mv_tipo: string;
    mv_qtde: number;
    mv_obse?: string;
}

export async function fetchStockBalance(empresa: string, itemId: number) {
    const params = [
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnIdCest', 'Int', itemId),
    ];
    return callProcedure<StockBalance>('consultaSaldoEstoque', params);
}

export async function fetchStockBalanceCommitted(empresa: string, itemId: number) {
    const params = [
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnIdCest', 'Int', itemId),
    ];
    return callProcedure<StockBalance>('consultaSaldoEstoqueEmpenhado', params);
}

export async function fetchStockCost(empresa: string, itemId: number) {
    const params = [
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnIdCest', 'Int', itemId),
    ];
    return callProcedure<{ ce_cust: number }>('consultaCustoCadastroEstoque', params);
}

export async function fetchStockCadastro(empresa: string, itemId: number) {
    const params = [
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnIdCest', 'Int', itemId),
    ];
    return callProcedure<StockBalance>('consultaCadastroEstoque', params);
}

export async function fetchStockMovements(
    empresa: string,
    startDate: string,
    endDate: string,
    worksiteId?: number | null,
    orderId?: number | null
) {
    const params = [
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('ldMvDtde', 'SmallDatetime', startDate),
        createParam('ldMvDtat', 'SmallDatetime', endDate),
        createParam('lnIdClie', 'Int', worksiteId || null),
        createParam('lnIdOrds', 'Int', orderId || null),
    ];
    return callProcedure<StockMovementRecord>('pesquisaMovimentacoesEstoque', params);
}

export async function fetchStockMovementsByDate(
    empresa: string,
    worksiteId: number,
    date: string
) {
    const params = [
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnIdClie', 'Int', worksiteId),
        createParam('ldMvData', 'SmallDatetime', date),
    ];
    return callProcedure<StockMovementRecord>('pesquisaMovimentacaoEstoque', params);
}

export async function fetchStockCadastros(
    empresa: string,
    search: string
) {
    const params = [
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lcCeDeno', 'VarChar', search),
    ];
    return callProcedure<StockBalance>('pesquisaCadastrosEstoque', params);
}

export async function fetchStockCadastrosReturn(
    empresa: string,
    worksiteId: number
) {
    const params = [
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnIdClie', 'Int', worksiteId),
    ];
    return callProcedure<StockBalance>('pesquisaCadastrosEstoqueParaDevolucaoEstoque', params);
}

export async function fetchStockCadastrosDevolucao(
    empresa: string,
    returnId: number
) {
    const params = [
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnIdDves', 'Int', returnId),
    ];
    return callProcedure<StockBalance>('pesquisaCadastrosEstoqueDevolucaoEstoque', params);
}
