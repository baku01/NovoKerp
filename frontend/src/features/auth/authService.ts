import { callProcedure, createParam } from '../../api/procedures';
import type { LoginResponse, Empresa } from '../../types';

/**
 * Authenticate user with credentials
 */
export async function login(username: string, password: string): Promise<LoginResponse> {
    const params = [
        createParam('lcIdUser', 'VarChar', username.trim().toUpperCase()),
        createParam('lcUsSmd5', 'VarChar', password.trim().toUpperCase()),
    ];

    const result = await callProcedure<LoginResponse>('consultaSenha', params);

    if (!result || result.length === 0) {
        throw new Error('Usuário ou senha inválidos');
    }

    return result[0];
}

/**
 * Fetch available companies
 */
export async function fetchEmpresas(): Promise<Empresa[]> {
    const result = await callProcedure<Empresa>('pesquisaEmpresas', []);
    return result;
}

/**
 * Fetch menu items for user
 */
export async function fetchMenu(empresa: string, userId: string) {
    const params = [
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lcIdUser', 'VarChar', userId),
        createParam('lcMnTipo', 'VarChar', null),
        createParam('lcIdPosi', 'VarChar', null),
    ];

    return callProcedure('pesquisaMenu', params);
}
