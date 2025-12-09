import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchNotifications, updateNotification } from './notificationService';
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

describe('notificationService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('builds params for fetching notifications', async () => {
    const params = (await fetchNotifications('USER', 'EMPR', { read: true, startDate: '2025-01-01', endDate: '2025-01-02' })) as unknown as MockParam[];
    expect(callProcedure).toHaveBeenCalledWith(
      'pesquisaNotificacoes',
      expect.any(Array)
    );
    expect(params[2]).toMatchObject({ pa_nome: 'lnNoRead', pa_valo: 0 });
  });

  it('builds params for updating notifications', async () => {
    const params = (await updateNotification('USER', 'EMPR', 10, true)) as unknown as MockParam[];
    expect(callProcedure).toHaveBeenCalledWith(
      'atualizaNotificacao',
      expect.any(Array)
    );
    const paramId = params.find((p) => p.pa_nome === 'lnIdNote');
    expect(paramId?.pa_valo).toBe(10);
  });
});
