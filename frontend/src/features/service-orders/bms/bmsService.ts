import { callProcedure, createParam } from '../../../api/procedures';
import type { BmsResourceRecord, BmsHourRate, BmsJourney } from './types';

function serializeOrderIds(orderIds: number[]): string {
    return orderIds
        .filter((id) => id > 0)
        .map((id) => id.toString().trim())
        .join('|');
}

export async function fetchBmsResourceRecords(
    empresa: string,
    worksiteId: number,
    orderIds: number[],
    startDate: Date,
    endDate: Date
): Promise<BmsResourceRecord[]> {
    if (!empresa) throw new Error('Empresa não definida');
    if (!worksiteId) throw new Error('Obra inválida');
    if (!orderIds.length) throw new Error('Nenhuma proposta encontrada para a obra selecionada');

    const payload = [
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnIdClie', 'Int', worksiteId),
        createParam('lcIdOrds', 'VarChar', serializeOrderIds(orderIds)),
        createParam('ldApData', 'SmallDatetime', null),
        createParam('ldApDtde', 'SmallDatetime', startDate.toISOString().slice(0, 10)),
        createParam('ldApDtat', 'SmallDatetime', endDate.toISOString().slice(0, 10)),
    ];

    return callProcedure<BmsResourceRecord>('pesquisaRecursosApontadosOrdensServico', payload);
}

export async function fetchBmsHourRates(
    empresa: string,
    orderIds: number[]
): Promise<BmsHourRate[]> {
    if (!empresa) throw new Error('Empresa não definida');
    if (!orderIds.length) throw new Error('Selecione ao menos uma proposta');

    const payload = [
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lcIdOrds', 'VarChar', serializeOrderIds(orderIds)),
    ];

    return callProcedure<BmsHourRate>('pesquisaValoresHoraFuncaoOrdensServico', payload);
}

export async function fetchBmsJourneys(
    empresa: string,
    orderIds: number[]
): Promise<BmsJourney[]> {
    if (!empresa) throw new Error('Empresa não definida');
    if (!orderIds.length) throw new Error('Selecione ao menos uma proposta');

    const payload = [
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lcIdOrds', 'VarChar', serializeOrderIds(orderIds)),
    ];

    return callProcedure<BmsJourney>('pesquisaJornadaOrdensServico', payload);
}
