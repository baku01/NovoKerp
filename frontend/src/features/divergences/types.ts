export interface AppointmentDivergence {
    id_matr: number;
    fu_nome: string;
    em_fant: string;
    fu_empr: string;
    ap_data: string; // Date
    id_clie: number;
    cl_fant: string;
    
    // Divergence Data
    ap_mnap: number; // Minutes from App
    ap_mnse: number; // Minutes from Secullum/Facial
    
    id_strc: number;
}

export interface StatusOption {
    id_strc: number;
    sr_deno: string;
}

export interface DivergenceFilters {
    startDate: Date | null;
    endDate: Date | null;
    worksiteId: number | null;
    statusId: number | null;
    employeeId: number | null;
    employeeName: string | null;
}
