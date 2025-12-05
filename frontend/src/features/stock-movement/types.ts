export interface StockMovementItem {
    id_cest: number;
    ce_codi: string;
    ce_deno: string;
    ce_espt: string;
    ce_unes: string;
    ce_tipo: string;
    ce_vcus: number;
    
    // Stock Info
    en_qtde: number;
    sa_qtde: number;
    de_qtde: number;
    
    // Movement Info
    mv_qtde: number; // The quantity being moved
    mv_pcus: number; // Cost of movement
    mv_motv: string; // Reason/Observation for item
}

export interface StockMovementHeader {
    id_clie: number;
    mv_tpme: 'E' | 'S'; // Entry / Exit
    mv_data: string; // Date
    mv_dpar: 'F' | 'P'; // Funcionario / Proposta

    id_empr_func?: string; // Company of employee
    id_matr_func?: number; // Employee ID

    id_ords?: number; // Service Order ID

    id_clie_cost?: number; // Cost Center Worksite (if F)

    mv_obse: string;
    mv_lati?: string;
    mv_long?: string;
}

export interface StockMovementPayload extends StockMovementHeader {
    items: StockMovementItem[];
}
