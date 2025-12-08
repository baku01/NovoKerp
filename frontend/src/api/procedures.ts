import { apiClient } from './client';

/**
 * SQL Parameter type matching the legacy backend format
 */
export interface SqlParam {
    pa_nome: string;
    pa_tipo: 'VarChar' | 'Int' | 'SmallDatetime' | 'Decimal' | 'Bit';
    pa_valo: string | number | null;
}

// Re-export apiClient for direct usage
export { apiClient };

/**
 * Adapter to call legacy stored procedures
 * @param procName - Name of the stored procedure
 * @param params - Array of SQL parameters
 * @returns Promise with the procedure result
 */
export async function callProcedure<T = unknown>(
    procName: string,
    params: SqlParam[]
): Promise<T[]> {
    try {
        const lcWkIsql = encodeURIComponent(JSON.stringify(params));

        const response = await apiClient.get('chamadaProcedure', {
            params: {
                lcWkIsql,
                lcWkProc: procName,
            },
        });

        return response.data as T[];
    } catch (error) {
        console.error(`Error calling procedure ${procName}:`, error);
        throw error;
    }
}

/**
 * Helper to create SQL parameters
 */
export function createParam(
    nome: string,
    tipo: SqlParam['pa_tipo'],
    valor: SqlParam['pa_valo']
): SqlParam {
    return {
        pa_nome: nome,
        pa_tipo: tipo,
        pa_valo: valor,
    };
}