export interface StockMovement {
    id_sequ: number;
    mv_docu: number; // Document Number
    mv_data: string; // Date
    mv_tpme: string; // 'E' (Entry/Devolution) or 'S' (Exit/Transfer)
    mv_obse: string; // Observation
    
    id_clie: number;
    cl_fant: string;
    
    // Items
    ce_codi: string;
    ce_deno: string;
    ce_espt: string;
    ce_unes: string;
    mv_qtde: number;
    mv_pcus: number;
    mv_tcus: number; // Total Cost
    
    // Context
    mv_user: string;
    sl_matr: number; // Employee ID who launched?
    sl_nome: string; // Employee Name who launched?
    
    // Links
    id_matr?: number;
    fu_nome?: string;
    id_ords?: number;
    os_nume?: string;
    os_desc?: string;
}

export interface StockMovementFilter {
    startDate: Date | null;
    endDate: Date | null;
    type: 'E' | 'S' | 'T'; // T=Todos
    searchType: 'F' | 'P'; // Funcionario / Proposta
    worksiteId: number | null;
    employeeId?: number | null; // For filter
    orderId?: number | null; // For filter
}

export interface StockCatalogItem {
    id_item: number; // or whatever ID the catalog uses
    ce_codi: string;
    ce_deno: string;
    ce_espt: string;
    ce_unes: string;
    // ...
}
