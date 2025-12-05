export interface ServiceMeasurementFilters {
    startDate: Date;
    endDate: Date;
    worksiteId: number | null;
    proposalIds: number[];
}

export interface MeasurementResource {
    ap_data: string; // Date
    id_ords: number;
    os_nume: string;
    os_desc: string;
    id_clie: number;
    cl_fant: string;
    id_matr: number;
    fu_nome: string; // Name
    fu_func: string; // Role
    cb_tmdo: string; // Type (MOD, MOI, EQP)
    ap_hent: number; // Entry
    ap_hiin: number; // Interval Start
    ap_htin: number; // Interval End
    ap_hter: number; // Exit
    ap_feri: number; // Holiday?

    // Calculated/Extended fields
    totalHours?: number;
    normalHours?: number;
    extra60Hours?: number;
    nightHours?: number;
    sundayHours?: number;
}

export interface ProposalRate {
    id_ords: number;
    fu_deno: string; // Role Name
    fu_vlhr: number; // Hourly Rate
}

export interface ProposalShift {
    id_ords: number;
    id_dsem: number; // Day of week (1-7)
    jo_mnts: number; // Minutes in shift
    jo_hent: number;
    jo_hiin: number;
    jo_htin: number;
    jo_hter: number;
}

export interface ProposalInfo {
    id_ords: number;
    os_nume: string;
    os_desc: string;
    os_tipo: number; // 1: Empreita, 2: HH, 3: Locacao, 4: Produto
    os_hdom: number; // % Sunday
    os_hext: number; // % Extra
    os_hnot: number; // % Night
    os_hdrs: number; // ?
    os_hers: number; // ?
    os_hnrs: number; // ?
    os_resp: string;
    os_ncli: string;
    os_ncon: string;
    cl_fant: string;
    id_cida: string;
    id_esta: string;
}
