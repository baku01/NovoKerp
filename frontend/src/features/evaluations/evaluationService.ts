import { callProcedure, createParam } from '../../api/procedures';
import { Evaluation, EvaluationWorksite, EmployeeCandidate, EvaluationFilters } from './types';
import { format } from 'date-fns';

export async function fetchEvaluations(
    empresa: string,
    filters: EvaluationFilters
): Promise<Evaluation[]> {
    const params = [
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('ldAvDtde', 'SmallDatetime', filters.startDate ? format(filters.startDate, 'yyyy-MM-dd') : null),
        createParam('ldAvDtat', 'SmallDatetime', filters.endDate ? format(filters.endDate, 'yyyy-MM-dd') : null),
        createParam('lnIdClie', 'Int', filters.worksiteId),
        createParam('lnIdMatr', 'Int', filters.employeeId),
        createParam('lcFuEmpr', 'VarChar', null),
        createParam('lcFuNome', 'VarChar', filters.employeeName || null),
    ];
    return callProcedure<Evaluation>('pesquisaAvaliacoes', params);
}

export async function fetchEvaluationWorksites(
    empresa: string,
    startDate?: Date,
    endDate?: Date
): Promise<EvaluationWorksite[]> {
    const params = [
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('ldAvDtde', 'SmallDatetime', startDate ? format(startDate, 'yyyy-MM-dd') : null),
        createParam('ldAvDtat', 'SmallDatetime', endDate ? format(endDate, 'yyyy-MM-dd') : null),
    ];
    return callProcedure<EvaluationWorksite>('pesquisaObrasAvaliadas', params);
}

// Reusing basic worksite search if needed for "Create New" dropdown which might differ from "Filter List" dropdown
export async function fetchAllWorksites(empresa: string): Promise<EvaluationWorksite[]> {
    const params = [
        createParam('lcIdUser', 'VarChar', '0'), // User ID often required but ignored or used for auth
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('ldDrData', 'SmallDatetime', null),
    ];
    // Legacy `pesquisaObrasDefinidas` used in `CadtFuAval`
    return callProcedure<EvaluationWorksite>('pesquisaObrasDefinidas', params);
}

export async function searchEmployees(
    empresa: string,
    worksiteId: number,
    searchTerm: string
): Promise<EmployeeCandidate[]> {
    // Legacy uses `pesquisaFuncionarios` with `dr_func` param implicitly handled by result
    const params = [
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('ldDrData', 'SmallDatetime', null),
        createParam('lnIdCadt', 'Int', worksiteId),
        createParam('lnIdMatr', 'Int', parseInt(searchTerm) || 0),
        createParam('lcFuEmpr', 'VarChar', null),
        createParam('lcFuNome', 'VarChar', isNaN(parseInt(searchTerm)) ? searchTerm : null),
    ];
    return callProcedure<EmployeeCandidate>('pesquisaFuncionarios', params);
}

export async function saveEvaluation(
    userId: string,
    empresa: string,
    evaluation: Partial<Evaluation>
): Promise<any[]> {
    // Legacy `insereAvaliacao`
    const params = [
        createParam('lcIdUser', 'VarChar', userId),
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnIdAval', 'Int', evaluation.id_aval || 0),
        createParam('ldAvData', 'SmallDatetime', evaluation.av_data || null),
        createParam('lnIdClie', 'Int', evaluation.id_clie || 0),
        createParam('lnIdMatr', 'Int', evaluation.id_matr || 0),
        createParam('lcFuEmpr', 'VarChar', (evaluation as any).fu_empr || ''), 
        
        createParam('lnAvOrga', 'Decimal', evaluation.av_orga || 0),
        createParam('lnAvProd', 'Decimal', evaluation.av_prod || 0),
        createParam('lnAvQual', 'Decimal', evaluation.av_qual || 0),
        createParam('lnAvDisc', 'Decimal', evaluation.av_disc || 0),
        createParam('lnAvFalt', 'Decimal', evaluation.av_falt || 0),
        createParam('lnAvCelu', 'Decimal', evaluation.av_celu || 0),
        createParam('lnAvAloj', 'Decimal', evaluation.av_aloj || 0),
        createParam('lnAvResc', 'Decimal', evaluation.av_resc || 0),
        createParam('lnAvFerr', 'Decimal', evaluation.av_ferr || 0),
        
        createParam('lnAvFabr', 'Decimal', evaluation.av_fabr || 0),
        createParam('lnAvMsol', 'Decimal', evaluation.av_msol || 0),
        createParam('lnAvMalt', 'Decimal', evaluation.av_malt || 0),
        createParam('lnAvTubu', 'Decimal', evaluation.av_tubu || 0),
        createParam('lnAvPtaa', 'Decimal', evaluation.av_ptaa || 0),
        
        createParam('lnAvSgsl', 'Decimal', evaluation.av_sgsl || 0),
        createParam('lcAvObse', 'VarChar', evaluation.av_obse || ''),
    ];
    return callProcedure('insereAvaliacao', params);
}

export async function deleteEvaluation(
    empresa: string,
    idAval: number
): Promise<any[]> {
    const params = [
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnIdAval', 'Int', idAval),
    ];
    return callProcedure('deletaAvaliacao', params);
}
