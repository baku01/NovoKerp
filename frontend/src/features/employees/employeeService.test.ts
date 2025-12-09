import { describe, it, expect } from 'vitest';
import {
    fetchEmployees,
    fetchObrasDefinidas,
    fetchTipos,
    fetchFuncoes,
    fetchQuantidadeRecursos,
    fetchDescricoesPlanejamentos
} from './employeeService';
import {
    mockEmployees,
    mockWorksites,
    mockEmployeeTypes,
    mockJobFunctions,
    mockResourceSummary,
    mockPlanningDescriptions
} from '../../mocks/fixtures';

describe('EmployeeService', () => {
    const mockUserId = 'admin';
    const mockEmpresa = '1';
    const mockData = '2024-12-08';

    describe('fetchEmployees', () => {
        it('should fetch all employees', async () => {
            const employees = await fetchEmployees(mockUserId, mockEmpresa, mockData, {
                idCadt: null,
                idCadtList: null,
                tipo: null,
                funcoes: null,
                idMatr: null,
                nome: null,
                pqEqto: null
            });

            expect(employees).toBeDefined();
            expect(employees.length).toBeGreaterThan(0);
            expect(employees).toEqual(mockEmployees);
        });

        it('should return employees with correct structure', async () => {
            const employees = await fetchEmployees(mockUserId, mockEmpresa, mockData, {
                idCadt: null,
                idCadtList: null,
                tipo: null,
                funcoes: null,
                idMatr: null,
                nome: null,
                pqEqto: null
            });
            const firstEmployee = employees[0];

            expect(firstEmployee).toHaveProperty('id_matr');
            expect(firstEmployee).toHaveProperty('fu_nome');
            expect(firstEmployee).toHaveProperty('fu_func');
            expect(firstEmployee).toHaveProperty('em_fant');
            expect(firstEmployee).toHaveProperty('cb_tmdo');
            expect(firstEmployee).toHaveProperty('ul_obra');
        });
    });

    describe('fetchObrasDefinidas', () => {
        it('should fetch all worksites', async () => {
            const worksites = await fetchObrasDefinidas(mockUserId, mockEmpresa, mockData);

            expect(worksites).toBeDefined();
            expect(worksites.length).toBe(mockWorksites.length);
            expect(worksites).toEqual(mockWorksites);
        });

        it('should return worksites with correct properties', async () => {
            const worksites = await fetchObrasDefinidas(mockUserId, mockEmpresa, mockData);
            const firstWorksite = worksites[0];

            expect(firstWorksite).toHaveProperty('id_clie');
            expect(firstWorksite).toHaveProperty('id_cadt');
            expect(firstWorksite).toHaveProperty('cl_fant');
        });
    });

    describe('fetchTipos', () => {
        it('should fetch all employee types', async () => {
            const types = await fetchTipos(mockUserId, mockEmpresa, mockData);

            expect(types).toBeDefined();
            expect(types.length).toBe(mockEmployeeTypes.length);
            expect(types).toEqual(mockEmployeeTypes);
        });
    });

    describe('fetchFuncoes', () => {
        it('should fetch all job functions', async () => {
            const functions = await fetchFuncoes(mockUserId, mockEmpresa, mockData);

            expect(functions).toBeDefined();
            expect(functions.length).toBe(mockJobFunctions.length);
            expect(functions).toEqual(mockJobFunctions);
        });
    });

    describe('fetchQuantidadeRecursos', () => {
        it('should fetch resource summary', async () => {
            const summary = await fetchQuantidadeRecursos(mockEmpresa, null, null, mockData);

            expect(summary).toBeDefined();
            expect(summary.length).toBe(mockResourceSummary.length);
            expect(summary).toEqual(mockResourceSummary);
        });
    });

    describe('fetchDescricoesPlanejamentos', () => {
        it('should fetch planning descriptions', async () => {
            const descriptions = await fetchDescricoesPlanejamentos(mockEmpresa, null, null, mockData);

            expect(descriptions).toBeDefined();
            expect(descriptions.length).toBe(mockPlanningDescriptions.length);
            expect(descriptions).toEqual(mockPlanningDescriptions);
        });
    });
});
