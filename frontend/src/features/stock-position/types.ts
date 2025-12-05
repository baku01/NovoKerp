export interface StockItem {
    id_clie: number;
    cl_fant: string;
    ce_deno: string; // Item Name
    ce_espt: string; // Specification?
    al_deno: string; // Category/Group?
    ce_tipo: string; // 'U' or 'A'?
    
    // Quantities
    sa_qtde: number; // Out Qty
    en_qtde: number; // In Qty
    
    // Costs
    sa_tcus: number; // Out Cost
    en_tcus: number; // In Cost
    
    // Context
    mv_data?: string; // Date
    mv_dtde?: string;
    mv_dtat?: string;
}

export interface StockPositionFilters {
    mode: 'POSITION' | 'CONSUMPTION'; // 'A' or 'U'
    worksiteId: number | null;
    date: Date | null; // For Position
    startDate: Date | null; // For Consumption
    endDate: Date | null; // For Consumption
    
    orderId?: number | null; // Proposal
    employeeId?: number | null; // Employee ID
    employeeCompany?: string | null; // Employee Company Code
}

export interface StockEmployee {
    id_matr: number;
    fu_nome: string;
    fu_empr: string;
}

export interface StockOrder {
    id_ords: number;
    os_nume: string;
    os_desc: string;
}
