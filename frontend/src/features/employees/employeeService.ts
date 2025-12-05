import { callProcedure, createParam } from '../../api/procedures';
import { Employee, Worksite, EmployeeType, JobFunction, ResourceSummary, PlanningDescription } from './types';

export async function fetchObrasDefinidas(
    userId: string,
    empresa: string,
    data: string
): Promise<Worksite[]> {
    const params = [
        createParam('lcIdUser', 'VarChar', userId),
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('ldDrData', 'SmallDatetime', data),
    ];
    return callProcedure<Worksite>('pesquisaObrasDefinidas', params);
}

export async function fetchTipos(
    userId: string,
    empresa: string,
    data: string
): Promise<EmployeeType[]> {
    const params = [
        createParam('lcIdUser', 'VarChar', userId),
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('ldDrData', 'SmallDatetime', data),
    ];
    return callProcedure<EmployeeType>('pesquisaTipos', params);
}

export async function fetchFuncoes(
    userId: string,
    empresa: string,
    data: string
): Promise<JobFunction[]> {
    const params = [
        createParam('lcIdUser', 'VarChar', userId),
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('ldDrData', 'SmallDatetime', data),
    ];
    return callProcedure<JobFunction>('pesquisaFuncoes', params);
}

export async function fetchQuantidadeRecursos(
    empresa: string,
    idCadt: number | null,
    idCadtList: string | null,
    data: string
): Promise<ResourceSummary[]> {
    const params = [
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnIdCadt', 'Int', idCadt),
        createParam('lcIdCadt', 'VarChar', idCadtList),
        createParam('ldDrData', 'SmallDatetime', data),
    ];
    return callProcedure<ResourceSummary>('pesquisaQuantidadeRecursosObraFuncao', params);
}

export async function fetchDescricoesPlanejamentos(
    empresa: string,
    idCadt: number | null,
    idCadtList: string | null,
    data: string
): Promise<PlanningDescription[]> {
    const params = [
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnIdCadt', 'Int', idCadt),
        createParam('lcIdCadt', 'VarChar', idCadtList),
        createParam('ldDrData', 'SmallDatetime', data),
    ];
    return callProcedure<PlanningDescription>('pesquisaDescricoesPlanejamentos', params);
}

export interface EmployeeFilters {
    idCadt: number | null;
    idCadtList: string | null;
    tipo: string | null;
    funcoes: string | null; // Pipe separated
    idMatr: number | null;
    nome: string | null;
    pqEqto: number | null;
}

export async function fetchEmployees(
    userId: string,
    empresa: string,
    data: string,
    filters: EmployeeFilters
): Promise<Employee[]> {
    const params = [
        createParam('lcIdUser', 'VarChar', userId),
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('ldDrData', 'SmallDatetime', data),
        createParam('lnIdCadt', 'Int', filters.idCadt),
        createParam('lcCbTmdo', 'VarChar', filters.tipo),
        createParam('lcFuFunc', 'VarChar', filters.funcoes),
        createParam('lnIdMatr', 'Int', filters.idMatr),
        createParam('lcFuNome', 'VarChar', filters.nome),
        createParam('lcIdCadt', 'VarChar', filters.idCadtList),
        createParam('lnPqEqto', 'Int', filters.pqEqto),
    ];
    return callProcedure<Employee>('pesquisaTodosFuncionarios', params);
}