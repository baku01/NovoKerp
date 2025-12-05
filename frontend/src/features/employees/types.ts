export interface Employee {
    id_matr: number;
    fu_nome: string;
    fu_func: string;
    em_fant: string;
    cb_tmdo: string;
    ul_obra: string;
    sr_deno: string;
    fu_reco: number;
    fu_sfix: number;
    fu_ncpf: string;
    fu_rgnu: string;
    fu_dtna: string;
    fu_dtad: string;
    fu_drec: string;
    fu_fcon: string;
    fu_dpro: string;
    dp_deno: string;
    fu_indi: string;
    ff_sala: number;
    fu_cida: string;
    fu_esta: string;
    fu_celu: string;
}

export interface Worksite {
    id_clie: number;
    id_cadt: number;
    cl_fant: string;
}

export interface EmployeeType {
    cb_tmdo: string;
}

export interface JobFunction {
    fu_func: string;
}

export interface ResourceSummary {
    fu_sgla: string;
    fu_qtde: number;
    rp_qtde: number;
    qt_rcso: number;
}

export interface PlanningDescription {
    fu_sgla: string;
    pl_tipo: string;
    pm_qtde: number;
    pm_dtde: string;
    pm_dtat: string;
    pl_desc: string;
}
