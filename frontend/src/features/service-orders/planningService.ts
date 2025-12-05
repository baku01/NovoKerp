import { callProcedure, createParam } from '../../api/procedures';
import { ServiceOrderProgress, ServiceOrderSituation } from './planningTypes';

export async function fetchServiceOrderProgress(
    empresa: string,
    idClie: number,
    idOrds: number,
    percent: number // Current or updated percent? Legacy sends input value to update/calculate?
): Promise<ServiceOrderProgress[]> {
    // Legacy `atualizaPorcentagemConclusao`
    // This procedure seems to *update* if `lnOsPcon` is passed, and return updated data.
    // If we just want to fetch, maybe pass 0 or null? 
    // Legacy code passes `parseFloat(loNrPcon.value)` which might be user input.
    // But initially it seems to call it to load data.
    // Let's separate "Fetch" and "Update" if possible, or use same.
    
    const params = [
        createParam('lcIdUser', 'VarChar', '0'), // Handled by auth usually
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnIdOrds', 'Int', idOrds),
        createParam('lnOsPcon', 'Decimal', percent),
        createParam('lnIdClie', 'Int', idClie),
    ];
    return callProcedure<ServiceOrderProgress>('atualizaPorcentagemConclusao', params);
}

export async function fetchServiceOrderEvolution(
    empresa: string,
    idOrds: number
): Promise<ServiceOrderProgress[]> {
    // `consultaAndamentoOS`
    const params = [
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnIdOrds', 'Int', idOrds),
    ];
    return callProcedure<ServiceOrderProgress>('consultaAndamentoOS', params);
}

export async function updateServiceOrderSituation(
    userId: string,
    empresa: string,
    idOrds: number,
    situation: string
): Promise<ServiceOrderSituation[]> {
    const params = [
        createParam('lcIdUser', 'VarChar', userId),
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnIdOrds', 'Int', idOrds),
        createParam('lcOsSitu', 'VarChar', situation),
    ];
    return callProcedure<ServiceOrderSituation>('insereSituacaoOrdemServico', params);
}

export async function fetchServiceOrderSituations(
    empresa: string,
    idOrds: number
): Promise<ServiceOrderSituation[]> {
    const params = [
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnIdOrds', 'Int', idOrds),
    ];
    return callProcedure<ServiceOrderSituation>('pesquisaSituacoesOrdemServico', params);
}

export async function deleteServiceOrderSituation(
    userId: string,
    empresa: string,
    idOrds: number,
    situation: string,
    date: string // The date of the situation record to delete
): Promise<ServiceOrderSituation[]> {
    const params = [
        createParam('lcIdUser', 'VarChar', userId),
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnIdOrds', 'Int', idOrds),
        createParam('ldOsData', 'SmallDatetime', date),
        createParam('lcOsSitu', 'VarChar', situation),
    ];
    return callProcedure<ServiceOrderSituation>('deletaSituacaoOrdemServico', params);
}
