export interface StockTransfer {
    id_strf: number;
    sl_data: string;
    id_clie: number;
    cl_fant: string;
    sl_dnec: string; // Needed Date
    st_deno: string;
    st_vcor: string;
    sl_qtde: number;
    sl_pcus: number;
    sl_user: string;
    ap_user?: string;
    ap_data?: string;
    sl_uenv?: string;
    sl_denv?: string;
    sl_ucon?: string;
    sl_dcon?: string;
    sl_dpre?: string;
    sl_drec?: string;
    sl_obse?: string;
    // ... other fields
}

export interface StockReturn {
    id_dves: number;
    id_clie: number;
    dl_data: string;
    cl_fant: string;
    st_deno: string;
    st_vcor: string;
    dl_qtde: number;
    dl_pcus: number;
    dl_user: string;
    ap_user?: string;
    ap_data?: string;
    dl_denv?: string;
    dl_ucon?: string;
    dl_dcon?: string;
    dl_dpre?: string;
    dl_drec?: string;
    dl_obse?: string;
}

export interface TransferFilters {
    startDate: Date;
    endDate: Date;
    worksiteId: number | null;
    statusId: number | null;
}

export interface TransferStatus {
    id_situ: number;
    st_deno: string;
    st_vcor: string;
}

export interface TransferItemInput {
    id_cest: number;
    quantity: number;
    unitCost: number;
    motive?: string;
}

export interface TransferRequestInput {
    worksiteId: number;
    neededDate: string; // yyyy-MM-dd
    notes?: string;
    items: TransferItemInput[];
}

export interface TransferStatusUpdate {
    transferId: number;
    worksiteId: number;
    notes?: string;
    sendDate?: string | null;
    receiveDate?: string | null;
}

export interface ReturnItemInput {
    id_cest: number;
    quantity: number;
    unitCost: number;
    motive?: string;
}

export interface ReturnRequestInput {
    worksiteId: number;
    returnDate: string; // yyyy-MM-dd
    notes?: string;
    items: ReturnItemInput[];
}
