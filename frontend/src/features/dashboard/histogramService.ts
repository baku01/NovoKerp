import { callProcedure, createParam } from '../../api/procedures';

export interface HistogramResource {
    id_cadt: number;
    id_clie: number; // Add this
    cl_fant: string;
    cl_hgnm: string; // Histogram Name (Custom)
    pd_cadt: number;
    qt_func: number; // Real Function Qty
    qt_eqto: number; // Real Equipment Qty
    pl_func: number; // Planned Function
    pl_eqto: number; // Planned Equipment
    rp_func: number; // Updated Function
    rp_eqto: number; // Updated Equipment
    ht_tmin: number; // Config Min Size
    ht_tmax: number; // Config Max Size
    id_novo: number; // New?
}

export async function fetchHistogramResources(
    empresa: string,
    data: string
): Promise<HistogramResource[]> {
    const params = [
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnIdCadt', 'Int', null), // Null for all
        createParam('ldDrData', 'SmallDatetime', data),
    ];
    return callProcedure<HistogramResource>('pesquisaQuantidadeRecursos', params);
}

export async function updateHistogramConfig(
    empresa: string,
    minSize: number,
    maxSize: number,
    data: string
): Promise<HistogramResource[]> {
    const params = [
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnHtTmin', 'Decimal', minSize),
        createParam('lnHtTmax', 'Decimal', maxSize),
        createParam('lnIdCadt', 'Int', null),
        createParam('ldDrData', 'SmallDatetime', data),
    ];
    return callProcedure<HistogramResource>('atualizaConfiguracaoHistograma', params);
}

export async function updateHistogramClientName(
    userId: string,
    empresa: string,
    idClie: number,
    name: string,
    data: string
): Promise<HistogramResource[]> {
    const params = [
        createParam('lcIdUser', 'VarChar', userId),
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnIdClie', 'Int', idClie),
        createParam('lcClHgnm', 'VarChar', name),
        createParam('ldDrData', 'SmallDatetime', data),
    ];
    return callProcedure<HistogramResource>('atualizaNomeClienteHistograma', params);
}
