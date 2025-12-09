export interface StockPosition {
    ce_deno: string; // Item Name
    ce_espt: string; // Specification
    ce_tipo: string; // 'U' (Usage) or 'A' (Asset/Stock) - though logic seems to use it to calc diffs
    al_deno: string; // Group/Category?
    
    // Usage columns
    sa_qtde: number;
    en_qtde: number;
    sa_tcus: number;
    en_tcus: number;

    // Additional fields might be present in response
    id_clie?: number;
    cl_fant?: string;
    mv_dtde?: string;
    mv_dtat?: string;
    mv_data?: string;
}

export interface StockPositionFilters {
    type: 'U' | 'A'; // U = Consumo, A = Posição
    date?: Date | null; // For Position
    startDate?: Date | null; // For Consumption
    endDate?: Date | null; // For Consumption
    worksiteId: number;
    employeeId?: number | null;
    employeeCompany?: string | null;
    serviceOrderId?: number | null;
}

export interface Worksite {
    id_clie: number;
    id_cadt: number;
    cl_fant: string;
}

export interface ServiceOrder {
    id_ords: number;
    os_nume: string;
    os_desc: string;
    id_cadt?: number;
    os_tipo?: number;
    os_hdrs?: number; // Valor adicional para domingos/feriados
    os_hers?: number; // Valor adicional para horas extras
    os_hnrs?: number; // Valor adicional para adicional noturno
    os_hdom?: number; // Percentual para domingos/feriados
    os_hext?: number; // Percentual para horas extras
    os_hnot?: number; // Percentual para adicional noturno
}

export interface EmployeeCandidate {
    id_matr: number;
    fu_nome: string;
    fu_empr: string;
}
