import { describe, it, expect } from 'vitest';
import {
    fetchDashboardObras,
    fetchApontamentosDivergentes,
    fetchApontamentosPendentes,
    fetchHorasPremio
} from './dashboardService';
import {
    mockDashboardObras,
    mockApontamentosDivergentes,
    mockApontamentosPendentes,
    mockHorasPremio
} from '../../mocks/fixtures';

describe('DashboardService', () => {
    const mockUserId = 'admin';
    const mockEmpresa = '1';
    const mockData = '2024-12-08';

    describe('fetchDashboardObras', () => {
        it('should fetch dashboard data for all construction sites', async () => {
            const obras = await fetchDashboardObras(mockUserId, mockEmpresa, mockData);

            expect(obras).toBeDefined();
            expect(obras.length).toBe(mockDashboardObras.length);
            expect(obras).toEqual(mockDashboardObras);
        });

        it('should return obras with correct structure', async () => {
            const obras = await fetchDashboardObras(mockUserId, mockEmpresa, mockData);
            const firstObra = obras[0];

            expect(firstObra).toHaveProperty('id_clie');
            expect(firstObra).toHaveProperty('id_cadt');
            expect(firstObra).toHaveProperty('cl_fant');
            expect(firstObra).toHaveProperty('cl_pavc'); // % completed
            expect(firstObra).toHaveProperty('cl_papl'); // % planned
            expect(firstObra).toHaveProperty('oc_qthr'); // budgeted hours
            expect(firstObra).toHaveProperty('re_hrap'); // realized hours
        });

        it('should have percentage values within valid range', async () => {
            const obras = await fetchDashboardObras(mockUserId, mockEmpresa, mockData);

            obras.forEach(obra => {
                expect(obra.cl_pavc).toBeGreaterThanOrEqual(0);
                expect(obra.cl_pavc).toBeLessThanOrEqual(100);
                expect(obra.cl_papl).toBeGreaterThanOrEqual(0);
                expect(obra.cl_papl).toBeLessThanOrEqual(100);
            });
        });
    });

    describe('fetchApontamentosDivergentes', () => {
        it('should fetch divergent appointments count', async () => {
            const divergentes = await fetchApontamentosDivergentes(mockUserId, mockEmpresa, mockData);

            expect(divergentes).toBeDefined();
            expect(divergentes.length).toBe(mockApontamentosDivergentes.length);
        });

        it('should return count structure correctly', async () => {
            const divergentes = await fetchApontamentosDivergentes(mockUserId, mockEmpresa, mockData);
            const first = divergentes[0];

            expect(first).toHaveProperty('id_cadt');
            expect(first).toHaveProperty('qt_dvrg');
            expect(typeof first.qt_dvrg).toBe('number');
        });
    });

    describe('fetchApontamentosPendentes', () => {
        it('should fetch pending appointments', async () => {
            const pendentes = await fetchApontamentosPendentes(mockUserId, mockEmpresa, mockData);

            expect(pendentes).toBeDefined();
            expect(pendentes.length).toBe(mockApontamentosPendentes.length);
        });

        it('should have pending count less than or equal to total', async () => {
            const pendentes = await fetchApontamentosPendentes(mockUserId, mockEmpresa, mockData);

            pendentes.forEach(item => {
                expect(item.qt_pndt).toBeLessThanOrEqual(item.qt_tota);
            });
        });
    });

    describe('fetchHorasPremio', () => {
        it('should fetch premium hours', async () => {
            const horasPremio = await fetchHorasPremio(mockEmpresa, mockData);

            expect(horasPremio).toBeDefined();
            expect(horasPremio.length).toBe(mockHorasPremio.length);
        });

        it('should return premium hours with correct structure', async () => {
            const horasPremio = await fetchHorasPremio(mockEmpresa, mockData);
            const first = horasPremio[0];

            expect(first).toHaveProperty('id_clie');
            expect(first).toHaveProperty('ah_hora');
            expect(typeof first.ah_hora).toBe('number');
        });
    });
});
