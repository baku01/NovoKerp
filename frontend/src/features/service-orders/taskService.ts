import { callProcedure } from '../../api/procedures';
import type { Task } from './types';

export const taskService = {
    async getTasks(idEmpr: string, idOrds: number): Promise<Task[]> {
        const params = [
            { pa_nome: 'lcIdEmpr', pa_tipo: 'VarChar' as const, pa_valo: idEmpr },
            { pa_nome: 'lnIdOrds', pa_tipo: 'Int' as const, pa_valo: idOrds },
        ];

        const result = await callProcedure<Task>('consultaTarefas', params);
        return result || [];
    },

    async updateRemainingDays(
        idEmpr: string,
        idOrds: number,
        idExcl: number,
        idAtiv: number,
        apDres: number
    ): Promise<Task[]> {
        const params = [
            { pa_nome: 'lcIdEmpr', pa_tipo: 'VarChar' as const, pa_valo: idEmpr },
            { pa_nome: 'lnIdOrds', pa_tipo: 'Int' as const, pa_valo: idOrds },
            { pa_nome: 'lnIdExcl', pa_tipo: 'Int' as const, pa_valo: idExcl },
            { pa_nome: 'lnIdAtiv', pa_tipo: 'Int' as const, pa_valo: idAtiv },
            { pa_nome: 'lnApDres', pa_tipo: 'Decimal' as const, pa_valo: apDres },
        ];

        const result = await callProcedure<Task>('atualizaDiasRestantes', params);
        return result || [];
    },
};
