import { callProcedure } from '../../api/procedures';
import type { Comment, ServiceOrder } from './types';

export const commentService = {
    async getComment(idEmpr: string, idClie: number, idOrds: number, cmData: string): Promise<Comment | null> {
        const params = [
            { pa_nome: 'lcIdEmpr', pa_tipo: 'VarChar' as const, pa_valo: idEmpr },
            { pa_nome: 'lnIdClie', pa_tipo: 'Int' as const, pa_valo: idClie },
            { pa_nome: 'lnIdOrds', pa_tipo: 'Int' as const, pa_valo: idOrds },
            { pa_nome: 'ldCmData', pa_tipo: 'SmallDatetime' as const, pa_valo: cmData },
        ];

        const result = await callProcedure<Comment>('consultaComentario', params);

        if (result && result.length > 0) {
            return result[0];
        }

        return null;
    },

    async searchServiceOrder(idEmpr: string, idCadt: number, osNume: string): Promise<ServiceOrder[]> {
        const params = [
            { pa_nome: 'lcIdEmpr', pa_tipo: 'VarChar' as const, pa_valo: idEmpr },
            { pa_nome: 'lnIdCadt', pa_tipo: 'Int' as const, pa_valo: idCadt },
            { pa_nome: 'lcOsNume', pa_tipo: 'VarChar' as const, pa_valo: osNume },
            { pa_nome: 'lcOsResp', pa_tipo: 'VarChar' as const, pa_valo: null },
            { pa_nome: 'lcOsDesc', pa_tipo: 'VarChar' as const, pa_valo: null },
            { pa_nome: 'lcOsNcli', pa_tipo: 'VarChar' as const, pa_valo: null },
            { pa_nome: 'lcOsNcon', pa_tipo: 'VarChar' as const, pa_valo: null },
        ];

        return await callProcedure<ServiceOrder>('pesquisaOrdensServico', params);
    },

    async saveComment(
        idEmpr: string,
        idClie: number,
        idOrds: number,
        cmData: string,
        cmDesc: string
    ): Promise<void> {
        const params = [
            { pa_nome: 'lcIdEmpr', pa_tipo: 'VarChar' as const, pa_valo: idEmpr },
            { pa_nome: 'lnIdClie', pa_tipo: 'Int' as const, pa_valo: idClie },
            { pa_nome: 'lnIdOrds', pa_tipo: 'Int' as const, pa_valo: idOrds },
            { pa_nome: 'ldCmData', pa_tipo: 'SmallDatetime' as const, pa_valo: cmData },
            { pa_nome: 'lcCmDesc', pa_tipo: 'VarChar' as const, pa_valo: cmDesc },
        ];

        await callProcedure('gravaComentario', params);
    },
};
