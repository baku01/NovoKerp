import {
    Employee,
    Worksite,
    EmployeeType,
    JobFunction,
    ResourceSummary,
    PlanningDescription
} from '../features/employees/types';
import {
    DashboardObra,
    ApontamentoDivergente,
    ApontamentoPendente,
    HourPremium
} from '../features/dashboard/dashboardService';
import { StockPosition } from '../features/stock-position/types';

// Types for mock data
interface MenuItem {
    id_menu: number;
    mn_item: string;
    mn_link: string;
    mn_icon: string;
}

// ========== AUTH DATA ==========
export const mockMenuItems: MenuItem[] = [
    { id_menu: 1, mn_item: 'Dashboard', mn_link: '/dashboard', mn_icon: 'dashboard' },
    { id_menu: 2, mn_item: 'Funcionários', mn_link: '/employees', mn_icon: 'people' },
    { id_menu: 3, mn_item: 'Ordens de Serviço', mn_link: '/service-orders', mn_icon: 'assignment' },
    { id_menu: 4, mn_item: 'Apontamentos', mn_link: '/appointments', mn_icon: 'schedule' },
    { id_menu: 5, mn_item: 'Estoque', mn_link: '/stock', mn_icon: 'inventory' },
    { id_menu: 6, mn_item: 'RDO', mn_link: '/daily-reports', mn_icon: 'description' },
];

export const mockCompanies = [
    { id_empr: 1, em_fant: 'Empresa Principal' },
    { id_empr: 2, em_fant: 'Empresa Filial A' },
    { id_empr: 3, em_fant: 'Empresa Filial B' },
];

export const mockUser = {
    id_user: 'admin',
    us_nome: 'Administrador',
    us_grup: 'ADM',
    us_empr: '1',
    us_smd5: 'hash123',
    id_posi: 1,
    id_oper: 1,
    ws_http: 'http://www.atscs.com.br/'
};

// ========== WORKSITE DATA ==========
export const mockWorksites: Worksite[] = [
    { id_clie: 1, id_cadt: 101, cl_fant: 'Obra Central - Shopping' },
    { id_clie: 2, id_cadt: 102, cl_fant: 'Obra Norte - Residencial' },
    { id_clie: 3, id_cadt: 103, cl_fant: 'Obra Sul - Comercial' },
    { id_clie: 4, id_cadt: 104, cl_fant: 'Obra Leste - Industrial' },
    { id_clie: 5, id_cadt: 105, cl_fant: 'Obra Oeste - Hospital' },
];

// ========== EMPLOYEE DATA ==========
export const mockEmployeeTypes: EmployeeType[] = [
    { cb_tmdo: 'CLT' },
    { cb_tmdo: 'PJ' },
    { cb_tmdo: 'Temporário' },
    { cb_tmdo: 'Terceirizado' },
];

export const mockJobFunctions: JobFunction[] = [
    { fu_func: 'Eletricista' },
    { fu_func: 'Encanador' },
    { fu_func: 'Pedreiro' },
    { fu_func: 'Engenheiro Civil' },
    { fu_func: 'Mestre de Obras' },
    { fu_func: 'Servente' },
    { fu_func: 'Carpinteiro' },
    { fu_func: 'Pintor' },
    { fu_func: 'Armador' },
    { fu_func: 'Operador de Máquinas' },
];

export const mockEmployees: Employee[] = [
    {
        id_matr: 1,
        fu_nome: 'João Silva',
        fu_func: 'Eletricista',
        em_fant: 'Empresa Principal',
        cb_tmdo: 'CLT',
        ul_obra: 'Obra Central - Shopping',
        sr_deno: 'Operacional',
        fu_reco: 0,
        fu_sfix: 3500,
        fu_ncpf: '123.456.789-00',
        fu_rgnu: '12.345.678-9',
        fu_dtna: '1985-05-15',
        fu_dtad: '2020-01-10',
        fu_drec: '2020-01-10',
        fu_fcon: '',
        fu_dpro: '2022-03-01',
        dp_deno: 'Manutenção',
        fu_indi: 'N',
        ff_sala: 3500,
        fu_cida: 'São Paulo',
        fu_esta: 'SP',
        fu_celu: '(11) 99999-9999'
    },
    {
        id_matr: 2,
        fu_nome: 'Maria Souza',
        fu_func: 'Engenheiro Civil',
        em_fant: 'Empresa Principal',
        cb_tmdo: 'PJ',
        ul_obra: 'Obra Norte - Residencial',
        sr_deno: 'Gerência',
        fu_reco: 0,
        fu_sfix: 8000,
        fu_ncpf: '987.654.321-00',
        fu_rgnu: '98.765.432-1',
        fu_dtna: '1990-11-20',
        fu_dtad: '2019-06-01',
        fu_drec: '2019-06-01',
        fu_fcon: '',
        fu_dpro: '2021-01-01',
        dp_deno: 'Engenharia',
        fu_indi: 'N',
        ff_sala: 8000,
        fu_cida: 'Rio de Janeiro',
        fu_esta: 'RJ',
        fu_celu: '(21) 98888-8888'
    },
    {
        id_matr: 3,
        fu_nome: 'Pedro Santos',
        fu_func: 'Pedreiro',
        em_fant: 'Empresa Principal',
        cb_tmdo: 'CLT',
        ul_obra: 'Obra Central - Shopping',
        sr_deno: 'Operacional',
        fu_reco: 0,
        fu_sfix: 2800,
        fu_ncpf: '111.222.333-44',
        fu_rgnu: '11.222.333-4',
        fu_dtna: '1988-03-25',
        fu_dtad: '2021-05-20',
        fu_drec: '2021-05-20',
        fu_fcon: '',
        fu_dpro: '2021-06-01',
        dp_deno: 'Construção',
        fu_indi: 'N',
        ff_sala: 2800,
        fu_cida: 'São Paulo',
        fu_esta: 'SP',
        fu_celu: '(11) 97777-7777'
    },
    {
        id_matr: 4,
        fu_nome: 'Ana Costa',
        fu_func: 'Mestre de Obras',
        em_fant: 'Empresa Filial A',
        cb_tmdo: 'CLT',
        ul_obra: 'Obra Sul - Comercial',
        sr_deno: 'Supervisão',
        fu_reco: 0,
        fu_sfix: 5500,
        fu_ncpf: '555.666.777-88',
        fu_rgnu: '55.666.777-8',
        fu_dtna: '1982-08-12',
        fu_dtad: '2018-03-15',
        fu_drec: '2018-03-15',
        fu_fcon: '',
        fu_dpro: '2020-01-01',
        dp_deno: 'Produção',
        fu_indi: 'N',
        ff_sala: 5500,
        fu_cida: 'Belo Horizonte',
        fu_esta: 'MG',
        fu_celu: '(31) 96666-6666'
    },
    {
        id_matr: 5,
        fu_nome: 'Carlos Oliveira',
        fu_func: 'Encanador',
        em_fant: 'Empresa Principal',
        cb_tmdo: 'Temporário',
        ul_obra: 'Obra Leste - Industrial',
        sr_deno: 'Operacional',
        fu_reco: 0,
        fu_sfix: 3200,
        fu_ncpf: '999.888.777-66',
        fu_rgnu: '99.888.777-6',
        fu_dtna: '1995-12-05',
        fu_dtad: '2023-01-10',
        fu_drec: '2023-01-10',
        fu_fcon: '2024-12-31',
        fu_dpro: '2023-02-01',
        dp_deno: 'Hidráulica',
        fu_indi: 'N',
        ff_sala: 3200,
        fu_cida: 'Curitiba',
        fu_esta: 'PR',
        fu_celu: '(41) 95555-5555'
    }
];

// ========== DASHBOARD DATA ==========
export const mockDashboardObras: DashboardObra[] = [
    {
        id_clie: 1,
        id_cadt: 101,
        cl_fant: 'Obra Central - Shopping',
        cl_pavc: 75.5,
        cl_papl: 80.0,
        cl_dant: -4.5,
        cl_dsac: '2023-10-25',
        cl_dtpt: '2024-12-31',
        cl_dttr: '2024-12-30',
        cl_dttp: '2024-12-31',
        cl_enca: 'Carlos Gerente',
        cl_plan: 'Ana Planejamento',
        cl_paft: 10000.00,
        cl_qrdo: 5,
        cl_qaro: 4,
        qt_modi: 2,
        qt_moda: 0,
        ap_data: '2024-12-08',
        oc_qthr: 10000,
        os_phcn: 9500,
        re_hrap: 7550,
        re_htap: 7800
    },
    {
        id_clie: 2,
        id_cadt: 102,
        cl_fant: 'Obra Norte - Residencial',
        cl_pavc: 45.0,
        cl_papl: 50.0,
        cl_dant: -5.0,
        cl_dsac: '2024-12-08',
        cl_dtpt: '2025-06-30',
        cl_dttr: '2025-06-30',
        cl_dttp: '2025-06-30',
        cl_enca: 'Roberto Engenheiro',
        cl_plan: 'Ana Planejamento',
        cl_paft: 5000.00,
        cl_qrdo: 3,
        cl_qaro: 3,
        qt_modi: 1,
        qt_moda: 0,
        ap_data: '2024-12-08',
        oc_qthr: 20000,
        os_phcn: 18000,
        re_hrap: 9000,
        re_htap: 9200
    },
    {
        id_clie: 3,
        id_cadt: 103,
        cl_fant: 'Obra Sul - Comercial',
        cl_pavc: 92.0,
        cl_papl: 90.0,
        cl_dant: 2.0,
        cl_dsac: '2024-12-08',
        cl_dtpt: '2024-12-20',
        cl_dttr: '2024-12-20',
        cl_dttp: '2024-12-20',
        cl_enca: 'Ana Costa',
        cl_plan: 'João Planejador',
        cl_paft: 15000.00,
        cl_qrdo: 8,
        cl_qaro: 7,
        qt_modi: 0,
        qt_moda: 1,
        ap_data: '2024-12-08',
        oc_qthr: 15000,
        os_phcn: 14500,
        re_hrap: 13800,
        re_htap: 14000
    }
];

export const mockApontamentosDivergentes: ApontamentoDivergente[] = [
    { id_cadt: 101, qt_dvrg: 3 },
    { id_cadt: 102, qt_dvrg: 5 },
    { id_cadt: 103, qt_dvrg: 0 },
];

export const mockApontamentosPendentes: ApontamentoPendente[] = [
    { id_cadt: 101, qt_pndt: 8, qt_tota: 100 },
    { id_cadt: 102, qt_pndt: 12, qt_tota: 150 },
    { id_cadt: 103, qt_pndt: 2, qt_tota: 80 },
];

export const mockHorasPremio: HourPremium[] = [
    { id_clie: 1, ah_hora: 120.5 },
    { id_clie: 2, ah_hora: 85.0 },
    { id_clie: 3, ah_hora: 45.5 },
];

export const mockResourceSummary: ResourceSummary[] = [
    { fu_sgla: 'ELT', fu_qtde: 8, rp_qtde: 6, qt_rcso: 2 },
    { fu_sgla: 'ENC', fu_qtde: 5, rp_qtde: 5, qt_rcso: 0 },
    { fu_sgla: 'PED', fu_qtde: 12, rp_qtde: 10, qt_rcso: 2 },
    { fu_sgla: 'ENG', fu_qtde: 3, rp_qtde: 3, qt_rcso: 0 },
];

export const mockPlanningDescriptions: PlanningDescription[] = [
    {
        fu_sgla: 'ELT',
        pl_tipo: 'Instalação',
        pm_qtde: 100,
        pm_dtde: '2024-12-01',
        pm_dtat: '2024-12-31',
        pl_desc: 'Instalação elétrica 1º andar'
    },
    {
        fu_sgla: 'ENC',
        pl_tipo: 'Tubulação',
        pm_qtde: 80,
        pm_dtde: '2024-12-01',
        pm_dtat: '2024-12-20',
        pl_desc: 'Sistema hidráulico banheiros'
    },
    {
        fu_sgla: 'PED',
        pl_tipo: 'Alvenaria',
        pm_qtde: 200,
        pm_dtde: '2024-11-15',
        pm_dtat: '2024-12-15',
        pl_desc: 'Levantamento paredes divisórias'
    },
];

// ========== SERVICE ORDER DATA ==========
export const mockServiceOrders = [
    {
        id_ords: 1,
        os_nume: 'OS-2024-001',
        cl_fant: 'Obra Central - Shopping',
        os_tipo: 1,
        os_desc: 'Instalação elétrica completa',
        os_situ: 'Em andamento',
        os_pcon: 75.5,
        oc_qthr: 5000,
        re_hrap: 3775,
        os_resp: 'João Silva',
        os_dtpc: '2024-12-08'
    },
    {
        id_ords: 2,
        os_nume: 'OS-2024-002',
        cl_fant: 'Obra Norte - Residencial',
        os_tipo: 2,
        os_desc: 'Fundação e estrutura',
        os_situ: 'Em andamento',
        os_pcon: 45.0,
        oc_qthr: 8000,
        re_hrap: 3600,
        os_resp: 'Maria Souza',
        os_dtpc: '2024-12-08'
    },
    {
        id_ords: 3,
        os_nume: 'OS-2024-003',
        cl_fant: 'Obra Sul - Comercial',
        os_tipo: 1,
        os_desc: 'Acabamento final',
        os_situ: 'Finalizado',
        os_pcon: 100.0,
        oc_qthr: 3000,
        re_hrap: 3000,
        os_resp: 'Ana Costa',
        os_dtpc: '2024-11-30'
    }
];

export const mockActivities = [
    { id_ativ: 1, at_desc: 'Instalação de Cabos' },
    { id_ativ: 2, at_desc: 'Montagem de Quadros' },
    { id_ativ: 3, at_desc: 'Tubulação Hidráulica' },
    { id_ativ: 4, at_desc: 'Alvenaria' },
    { id_ativ: 5, at_desc: 'Pintura' },
    { id_ativ: 6, at_desc: 'Revestimento' },
];

export const mockSituacoesRecurso = [
    { id_strc: 1, si_desc: 'Presente' },
    { id_strc: 2, si_desc: 'Falta' },
    { id_strc: 3, si_desc: 'Atestado' },
    { id_strc: 4, si_desc: 'Férias' },
];

export const mockJustificativas = [
    { id_just: 1, jf_desc: 'Clima Adverso' },
    { id_just: 2, jf_desc: 'Falta de Material' },
    { id_just: 3, jf_desc: 'Problema de Equipamento' },
    { id_just: 4, jf_desc: 'Retrabalho' },
];

// ========== STOCK DATA ==========
export const mockStockPosition: StockPosition[] = [
    {
        ce_deno: 'Cimento CP-II 50kg',
        ce_espt: 'Cimento Portland',
        ce_tipo: 'Material',
        al_deno: 'Almoxarifado Central',
        sa_qtde: 500,
        en_qtde: 200,
        sa_tcus: 15000.00,
        en_tcus: 6000.00,
        id_clie: 1,
        cl_fant: 'Obra Central - Shopping'
    },
    {
        ce_deno: 'Tijolo 6 Furos',
        ce_espt: 'Cerâmica',
        ce_tipo: 'Material',
        al_deno: 'Almoxarifado Central',
        sa_qtde: 10000,
        en_qtde: 5000,
        sa_tcus: 5000.00,
        en_tcus: 2500.00,
        id_clie: 1,
        cl_fant: 'Obra Central - Shopping'
    },
    {
        ce_deno: 'Fio Elétrico 2.5mm',
        ce_espt: 'Cobre',
        ce_tipo: 'Material',
        al_deno: 'Almoxarifado Norte',
        sa_qtde: 1000,
        en_qtde: 300,
        sa_tcus: 8000.00,
        en_tcus: 2400.00,
        id_clie: 2,
        cl_fant: 'Obra Norte - Residencial'
    }
];

export const mockStockMovementItems = [
    {
        id_cest: 1,
        ce_codi: 'MAT-001',
        ce_deno: 'Cimento CP-II 50kg',
        ce_espt: 'Cimento Portland',
        ce_unes: 'SC',
        ce_tipo: 'Material',
        ce_vcus: 30.00,
        en_qtde: 200,
        sa_qtde: 500,
        de_qtde: 0,
        mv_qtde: 0,
        mv_pcus: 30.00
    },
    {
        id_cest: 2,
        ce_codi: 'MAT-002',
        ce_deno: 'Tijolo 6 Furos',
        ce_espt: 'Cerâmica',
        ce_unes: 'UN',
        ce_tipo: 'Material',
        ce_vcus: 0.50,
        en_qtde: 5000,
        sa_qtde: 10000,
        de_qtde: 0,
        mv_qtde: 0,
        mv_pcus: 0.50
    }
];

// ========== DAILY REPORT DATA ==========
export const mockDailyReports = [
    {
        id_clie: 1,
        cl_fant: 'Obra Central - Shopping',
        ro_data: '2024-12-08',
        ro_ords: '1,2',
        ro_nume: 'RDO-001'
    },
    {
        id_clie: 2,
        cl_fant: 'Obra Norte - Residencial',
        ro_data: '2024-12-07',
        ro_ords: '2',
        ro_nume: 'RDO-002'
    }
];

export const mockPhotos = [
    {
        id_clie: 1,
        ro_data: '2024-12-08',
        ro_ords: '1',
        ro_foto: 'http://www.atscs.com.br/fotos/obra1_foto1.jpg',
        nm_foto: 'foto1.jpg',
        ex_sdir: '/fotos/'
    }
];

// ========== DOCUMENTS DATA ==========
export const mockDocuments = [
    {
        id_docu: 1,
        dc_desc: 'Contrato de Empreitada',
        dc_arqu: 'contrato_001.pdf',
        dc_data: '2024-01-15',
        id_clie: 1
    },
    {
        id_docu: 2,
        dc_desc: 'Projeto Elétrico',
        dc_arqu: 'projeto_eletrico.pdf',
        dc_data: '2024-02-10',
        id_clie: 1
    }
];
