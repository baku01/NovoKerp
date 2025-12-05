import { callProcedure, createParam } from '../../api/procedures';
import { DismissedEmployee, JobFunction, RecruitmentFilters } from './types';

export async function fetchDismissedEmployees(
    empresa: string,
    filters: RecruitmentFilters
): Promise<DismissedEmployee[]> {
    const funcString = filters.functions.length > 0 ? filters.functions.join('|') : null;
    
    const params = [
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('ldDrData', 'SmallDatetime', null), // Uses current date logic in legacy but passed as string
        createParam('lcFuFunc', 'VarChar', funcString),
        createParam('lnIdMatr', 'Int', filters.searchType === 'ID_MATR' ? parseInt(filters.searchTerm) || 0 : null),
        createParam('lcFuNome', 'VarChar', filters.searchType === 'NOME' ? filters.searchTerm : null),
    ];
    return callProcedure<DismissedEmployee>('pesquisaFuncionariosDemitidos', params);
}

export async function fetchRecruitmentFunctions(
    userId: string,
    empresa: string
): Promise<JobFunction[]> {
    const params = [
        createParam('lcIdUser', 'VarChar', userId),
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('ldDrData', 'SmallDatetime', null), // Today
    ];
    return callProcedure<JobFunction>('pesquisaFuncoes', params);
}
