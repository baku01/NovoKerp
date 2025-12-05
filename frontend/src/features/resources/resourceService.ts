import { callProcedure, createParam } from '../../api/procedures';
import { ResourceWithContract } from './types';

export async function fetchResourcesWithStatus(
    empresa: string,
    idClie: number,
    date: string
): Promise<ResourceWithContract[]> {
    // `pesquisaRecursos` returns pending info logic in legacy `ComlDrRcso.js`
    // It seems `pesquisaRecursos` returns `ap_ords` etc.
    const params = [
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnIdCadt', 'Int', idClie),
        createParam('ldDrData', 'SmallDatetime', date),
    ];
    return callProcedure<ResourceWithContract>('pesquisaRecursos', params);
}
