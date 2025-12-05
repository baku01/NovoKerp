export interface DismissedEmployee {
    id_matr: number;
    fu_nome: string;
    fu_func: string;
    em_fant: string;
    cb_tmdo: string;
    fu_ncpf: string;
    fu_rgnu: string;
    fu_dtad: string; // Admission Date
    fu_drec: string; // Rescision Date
    fu_fcon: string; // End Experience Contract
    fu_dpro: string; // Prorogation
    fu_reco: number; // Re-hired status (> 1 means YES)
    dp_deno: string; // Department/Worksite
    ul_obra: string; // Last Worksite
    sr_deno: string; // Status
    fu_indi: string; // Indication
    ff_sala: number; // Salary
    fu_cida: string;
    fu_esta: string;
    fu_celu: string;
    fu_nota: number; // Last Evaluation Score
}

export interface JobFunction {
    fu_func: string;
}

export interface RecruitmentFilters {
    functions: string[]; // Pipe separated in legacy
    searchType: 'NOME' | 'ID_MATR';
    searchTerm: string;
}
