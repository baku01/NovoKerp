export interface ResourceWithContract {
    id_matr: number;
    fu_nome: string;
    fu_func: string;
    fu_empr: string;
    cb_tmdo: string;
    fu_fcon: string; // End of contract exp
    fu_dpro: string; // Prorogation
    ap_ords: number; // Pending Orders?
    ap_mnts: number; // Minutes?
    to_cont: number;
    to_con1: number;
    
    // Selection
    dr_chck?: boolean;
}

// Re-using AppointmentResource for now but expanding if needed
