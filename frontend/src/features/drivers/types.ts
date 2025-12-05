export interface Driver {
    id_moto: number;
    mo_nome: string;
    mo_cnhn: string; // CNH
    mo_cate: string; // Category
    mo_valc: string; // CNH Expiration
    mo_vald: string; // Defensive Driving Course Expiration
    mo_valm: string; // MOPP Expiration
    mo_vale: string; // Special Driving Expiration
    id_sit: number;
    si_nome: string;
}

export interface DriverFilters {
    statusId: number | null;
    searchTerm: string;
}
