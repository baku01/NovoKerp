export interface StockReturn {
    id_dves: number;
    cl_fant: string;
    dl_data: string; // Date
    dl_qtde: number;
    dl_pcus: number; // Cost
    dl_user: string; // User who requested
    
    st_deno: string; // Status description
    id_situ: number;
    st_vcor: string; // Status color (RGB string e.g. "255, 0, 0")
    
    // Approval Info
    ap_user: string;
    ap_data: string;
    
    // Logistics Info
    dl_denv: string; // Sent date
    dl_ucon: string; // User contested
    dl_dcon: string; // Date contested
    dl_dpre: string; // Predicted delivery
    dl_drec: string; // Received date
    dl_obse: string; // Observation
}

export interface StockTransferRequest {
    id_strf: number;
    cl_fant: string;
    sl_data: string;
    sl_dnec: string; // Needed date
    sl_qtde: number;
    sl_pcus: number;
    sl_user: string;
    
    st_deno: string;
    id_situ: number;
    st_vcor: string;
    
    // Approval
    ap_user: string;
    ap_data: string;
    
    // Logistics
    sl_uenv: string;
    sl_denv: string;
    sl_ucon: string;
    sl_dcon: string;
    sl_dpre: string;
    sl_drec: string;
    sl_obse: string;
}

export interface StockWorksite {
    id_clie: number;
    cl_fant: string;
}

export interface StockStatusOption {
    id_situ: number;
    st_deno: string;
    st_vcor: string; // RGB
    st_ativ?: number; // Active status flag?
    st_aprv?: number; // Approved status flag?
}

export interface StockFilters {
    startDate: Date | null;
    endDate: Date | null;
    statusId: number | null;
    worksiteId: number | null;
}
