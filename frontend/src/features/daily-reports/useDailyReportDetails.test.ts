import { describe, it, expect } from 'vitest';
import { format } from 'date-fns';
import {
    fetchRdoResources,
    fetchRdoResourcesByDate,
    fetchRdoWorksitesByDate,
    fetchRdoOrdersByDate,
    checkRdoFinalized,
} from './dailyReportService';

const EMPRESA = 'EMPR1';
const TODAY = new Date('2025-01-09');

describe('dailyReportService (RDO detalhes)', () => {
    it('fetches resources for a report', async () => {
        const res = await fetchRdoResources(EMPRESA, 1, TODAY);
        expect(res.length).toBeGreaterThan(0);
    });

    it('fetches resources by date', async () => {
        const res = await fetchRdoResourcesByDate(EMPRESA, 1, TODAY);
        expect(res[0]?.ap_data).toBe('2025-01-09');
    });

    it('fetches worksites by date', async () => {
        const res = await fetchRdoWorksitesByDate(EMPRESA, TODAY);
        expect(res[0]?.id_clie).toBeDefined();
    });

    it('fetches orders by date', async () => {
        const res = await fetchRdoOrdersByDate(EMPRESA, 1, TODAY);
        expect(res[0]?.id_ords).toBeDefined();
    });

    it('checks if RDO is finalized', async () => {
        const res = await checkRdoFinalized(EMPRESA, 1, TODAY, 10);
        expect(res[0]?.finalized).toBeDefined();
    });
});
