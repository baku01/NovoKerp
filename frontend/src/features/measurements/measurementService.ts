import { callProcedure, createParam } from '../../api/procedures';
import { MeasurementResource, ProposalRate, ProposalShift, ProposalInfo, ServiceMeasurementFilters } from './types';
import { format } from 'date-fns';

export async function fetchMeasurementResources(
    empresa: string,
    filters: ServiceMeasurementFilters
): Promise<MeasurementResource[]> {
    const proposalIdsStr = filters.proposalIds.join('|');

    const params = [
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnIdClie', 'Int', filters.worksiteId),
        createParam('lcIdOrds', 'VarChar', proposalIdsStr),
        createParam('ldApData', 'SmallDatetime', null),
        createParam('ldApDtde', 'SmallDatetime', format(filters.startDate, 'yyyy-MM-dd')),
        createParam('ldApDtat', 'SmallDatetime', format(filters.endDate, 'yyyy-MM-dd')),
    ];
    return callProcedure<MeasurementResource>('pesquisaRecursosApontadosOrdensServico', params);
}

export async function fetchProposalRates(
    empresa: string,
    proposalIds: number[]
): Promise<ProposalRate[]> {
    const proposalIdsStr = proposalIds.join('|');
    const params = [
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lcIdOrds', 'VarChar', proposalIdsStr),
    ];
    return callProcedure<ProposalRate>('pesquisaValoresHoraFuncaoOrdensServico', params);
}

export async function fetchProposalShifts(
    empresa: string,
    proposalIds: number[],
    worksiteId: number
): Promise<ProposalShift[]> {
    const proposalIdsStr = proposalIds.join('|');
    const params = [
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnIdClie', 'Int', worksiteId),
        createParam('lcIdOrds', 'VarChar', proposalIdsStr),
    ];
    return callProcedure<ProposalShift>('pesquisaJornadaOrdensServico', params);
}

export async function fetchProposalDetails(
    empresa: string,
    worksiteId: number
): Promise<ProposalInfo[]> {
    // Reusing 'pesquisaPropostas' but mapping to ProposalInfo
    // The legacy code calls 'pesquisaPropostas' with some nulls
    const params = [
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnIdCadt', 'Int', worksiteId),
        createParam('lcOsNume', 'VarChar', null),
        createParam('lcOsResp', 'VarChar', null),
        createParam('lcOsDesc', 'VarChar', null),
        createParam('lcOsNcli', 'VarChar', null),
        createParam('lcOsNcon', 'VarChar', null),
    ];
    return callProcedure<ProposalInfo>('pesquisaPropostas', params);
}

export async function logMeasurementGeneration(
    empresa: string,
    user: string,
    worksiteName: string,
    proposalInfo: string
): Promise<void> {
    const logMessage = `O USUÁRIO ${user} GEROU UM BMS DA OBRA ${worksiteName} ${proposalInfo}`;
    const params = [
        createParam('lcIdUser', 'VarChar', user),
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lcLgProg', 'VarChar', 'COMLAPBMSV'), // React Version
        createParam('lcLgOcor', 'VarChar', logMessage),
        createParam('lcLgTipo', 'VarChar', 'A'),
    ];
    await callProcedure('insereLog', params);
}
