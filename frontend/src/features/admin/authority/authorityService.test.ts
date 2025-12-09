import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchMenu, fetchAuthorities, updateAuthorities } from './authorityService';
import { callProcedure } from '../../../api/procedures';

vi.mock('../../../api/procedures', () => {
  const callProcedureMock = vi.fn(async (_name: string, params: unknown[]) => params);
  const createParam = (pa_nome: string, pa_tipo: string, pa_valo: unknown) => ({ pa_nome, pa_tipo, pa_valo });
  return { callProcedure: callProcedureMock, createParam };
});

interface MockParam {
  pa_nome: string;
  pa_valo: unknown;
}

describe('authorityService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches menu with company filter', async () => {
    const params = (await fetchMenu('EMPR', null)) as unknown as MockParam[];
    expect(callProcedure).toHaveBeenCalledWith('pesquisaMenu', expect.any(Array));
    expect(params[0]).toMatchObject({ pa_nome: 'lcIdEmpr', pa_valo: 'EMPR' });
  });

  it('fetches authorities for a user', async () => {
    const params = (await fetchAuthorities('EMPR', 'USER')) as unknown as MockParam[];
    expect(callProcedure).toHaveBeenCalledWith('pesquisaAutoridades', expect.any(Array));
    expect(params.find((p) => p.pa_nome === 'lcIdUser')?.pa_valo).toBe('USER');
  });

  it('updates authorities with merged positions', async () => {
    const params = (await updateAuthorities('EMPR', 'USER', ['+0000001', '+0000002'])) as unknown as MockParam[];
    expect(callProcedure).toHaveBeenCalledWith('insereAutoridade', expect.any(Array));
    expect(params.find((p) => p.pa_nome === 'lcAtChck')?.pa_valo).toContain('M0000001');
  });
});
