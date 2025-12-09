import { describe, it, expect } from 'vitest';
import { format } from 'date-fns';
import {
    fetchSecullumAppointments,
    fetchSecullumAppointmentsByEmployee,
    fetchSecullumHistory,
    insertManualSecullum,
    updateSecullum,
    deleteSecullum,
    fetchJourney,
    fetchJourneyResources,
    fetchAppointmentsByEmployee,
    fetchHoliday,
    fetchAbsenceJustifications,
    fetchResourceStatuses,
} from './secullumService';

const EMPRESA = 'EMPR1';
const USER_ID = 'TESTUSER';
const TODAY = new Date('2025-01-10');

describe('secullumService', () => {
    it('lists secullum appointments by obra', async () => {
        const res = await fetchSecullumAppointments(EMPRESA, 1, TODAY);
        expect(res.length).toBeGreaterThan(0);
    });

    it('lists secullum appointments by employee', async () => {
        const res = await fetchSecullumAppointmentsByEmployee(EMPRESA, 123, TODAY);
        expect(res[0]?.id_matr).toBe(123);
    });

    it('gets history', async () => {
        const res = await fetchSecullumHistory(EMPRESA, 123, TODAY);
        expect(res[0]?.es_data).toBe('2025-01-10');
    });

    it('inserts, updates and deletes manual entry', async () => {
        await insertManualSecullum(USER_ID, EMPRESA, 123, TODAY, {
            hent: 8,
            hiin: 12,
            htin: 13,
            hter: 17,
            justification: 'Ajuste manual',
        });
        await updateSecullum(USER_ID, EMPRESA, 9999, {
            hent: 9,
            justification: 'Correção',
        });
        await deleteSecullum(EMPRESA, 9999);
    });

    it('fetches jornada e recursos', async () => {
        await fetchJourney(EMPRESA, 1, TODAY);
        await fetchJourneyResources(EMPRESA, 1, TODAY);
    });

    it('fetches apontamentos por funcionário no período', async () => {
        const res = await fetchAppointmentsByEmployee(EMPRESA, 123, TODAY, TODAY);
        expect(Array.isArray(res)).toBe(true);
    });

    it('fetches feriado, justificativas e status recurso', async () => {
        const feriado = await fetchHoliday(EMPRESA, TODAY);
        expect(feriado[0]?.isHoliday).toBeDefined();

        const just = await fetchAbsenceJustifications(EMPRESA);
        expect(just.length).toBeGreaterThan(0);

        const statuses = await fetchResourceStatuses(EMPRESA);
        expect(statuses.length).toBeGreaterThan(0);
    });
});
