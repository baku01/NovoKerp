import { describe, it, expect } from 'vitest';
import {
    fetchStockBalance,
    fetchStockBalanceCommitted,
    fetchStockCost,
    fetchStockCadastro,
    fetchStockMovements,
    fetchStockMovementsByDate,
    fetchStockCadastros,
    fetchStockCadastrosReturn,
    fetchStockCadastrosDevolucao,
} from './stockLegacyService';

const EMPRESA = 'EMPR1';

describe('stockLegacyService', () => {
    it('fetches stock balance and committed', async () => {
        const bal = await fetchStockBalance(EMPRESA, 10);
        expect(bal[0]?.id_cest).toBeDefined();
        const emp = await fetchStockBalanceCommitted(EMPRESA, 10);
        expect(emp[0]?.saldo_empenhado).toBeDefined();
    });

    it('fetches stock cost', async () => {
        const cost = await fetchStockCost(EMPRESA, 10);
        expect(cost[0]?.ce_cust).toBeDefined();
    });

    it('fetches stock cadastro', async () => {
        const cad = await fetchStockCadastro(EMPRESA, 10);
        expect(cad[0]?.ce_desc).toBeDefined();
    });

    it('fetches stock movements (range and date)', async () => {
        const movRange = await fetchStockMovements(EMPRESA, '2025-01-01', '2025-01-10', 1, 5);
        expect(movRange.length).toBeGreaterThan(0);
        const movDate = await fetchStockMovementsByDate(EMPRESA, 1, '2025-01-08');
        expect(movDate.length).toBeGreaterThan(0);
    });

    it('fetches cadastros lists', async () => {
        const all = await fetchStockCadastros(EMPRESA, 'CABO');
        expect(all.length).toBeGreaterThan(0);
        const ret = await fetchStockCadastrosReturn(EMPRESA, 1);
        expect(ret.length).toBeGreaterThan(0);
        const dev = await fetchStockCadastrosDevolucao(EMPRESA, 8001);
        expect(dev.length).toBeGreaterThan(0);
    });
});
