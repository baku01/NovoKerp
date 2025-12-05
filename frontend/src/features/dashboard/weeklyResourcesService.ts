import { callProcedure, createParam } from '../../api/procedures';

export interface WorksiteWithResource {
    id_clie: number;
    cl_fant: string;
    pd_clie: number; // seems to be a pre-selection flag?
}

export interface ResourceType {
    fu_sgla: string;
    pd_sgla: number; // pre-selection flag?
}

export interface RealResourceUsage {
    fu_sgla: string;
    qt_rcso: number;
    pm_dtat: string; // Date updated?
}

export interface UpdatedResourceUsage {
    fu_sgla: string;
    at_qtde: number;
    pm_data: string; // Date
}

export async function fetchWorksitesWithResources(
    empresa: string,
    data: string
): Promise<WorksiteWithResource[]> {
    const params = [
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('ldDrData', 'SmallDatetime', data),
    ];
    return callProcedure<WorksiteWithResource>('pesquisaObrasComRecurso', params);
}

export async function fetchResourceTypes(
    empresa: string
): Promise<ResourceType[]> {
    const params = [
        createParam('lcIdEmpr', 'VarChar', empresa),
    ];
    return callProcedure<ResourceType>('pesquisaSiglas', params);
}

export async function fetchRealResourceUsage(
    empresa: string,
    data: string,
    worksiteIds: string[], // "1, 2, 3"
    resourceTypes: string[] // "ENC, PED, SER"
): Promise<RealResourceUsage[]> {
    const params = [
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('ldDrData', 'SmallDatetime', data),
        createParam('lcIdClie', 'VarChar', worksiteIds.join(', ')),
        createParam('lcFuSgla', 'VarChar', resourceTypes.join(', ')),
    ];
    return callProcedure<RealResourceUsage>('pesquisaQuantidadeRecursosObraFuncaoReal', params);
}

export async function fetchUpdatedResourceUsage(
    empresa: string,
    date: string,
    worksiteIds: string[],
    resourceTypes: string[]
): Promise<UpdatedResourceUsage[]> {
    const params = [
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('ldPmData', 'SmallDatetime', date),
        createParam('lcIdClie', 'VarChar', worksiteIds.join(', ')),
        createParam('lcFuSgla', 'VarChar', resourceTypes.join(', ')),
    ];
    return callProcedure<UpdatedResourceUsage>('pesquisaQuantidadeRecursosObraFuncaoAtualizacao', params);
}
