import { callProcedure, createParam } from '../../api/procedures';

export interface SalaryWorksite {
    id_cadt: number;
    cl_fant: string;
}

export interface SalaryChartData {
    fu_sgla: string;
    sa_sala: number;
    sa_data: string; // Date
}

export interface SalarySummaryData {
    fu_sgla: string;
    sa_sala: number;
}

export async function fetchSalaryWorksites(
    userId: string,
    empresa: string
): Promise<SalaryWorksite[]> {
    const params = [
        createParam('lcIdUser', 'VarChar', userId),
        createParam('lcIdEmpr', 'VarChar', empresa),
    ];
    return callProcedure<SalaryWorksite>('pesquisaObras', params);
}

export async function fetchSalaryChartData(
    empresa: string,
    worksiteId: number | null,
    startDate: string,
    endDate: string,
    functionSgla: string | null
): Promise<SalaryChartData[]> {
    const params = [
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnIdCadt', 'Int', worksiteId),
        createParam('ldSaDtde', 'SmallDatetime', startDate),
        createParam('ldSaDtat', 'SmallDatetime', endDate),
        createParam('lcFuSgla', 'VarChar', functionSgla),
    ];
    return callProcedure<SalaryChartData>('pesquisaMediaSalarial', params);
}

export async function fetchSalarySummaryData(
    empresa: string,
    worksiteId: number | null,
    startDate: string,
    endDate: string
): Promise<SalarySummaryData[]> {
    const params = [
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnIdCadt', 'Int', worksiteId),
        createParam('ldSaDtde', 'SmallDatetime', startDate),
        createParam('ldSaDtat', 'SmallDatetime', endDate),
    ];
    return callProcedure<SalarySummaryData>('consultaMediaSalarial', params);
}
