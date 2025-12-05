export interface ProductionOrder {
    po_nume: number;
    po_data: string; // Date
    id_clie: number;
    cl_fant: string;
    os_nume: string;
    os_desc: string;
    po_plan: string; // Planner
    po_soli: string; // Requester
    po_dtnc: string; // Need Date
    po_dtpi: string; // Predicted Start Date
    po_hrdi: number; // Hours Available
    ps_situ: string; // Status
    po_desc: string; // Description
}

export interface ProductionOrderItem {
    id_item: number;
    po_nume: number;
    pi_desc: string; // Description
}

export interface ProductionOrderFilter {
    startDate: Date;
    endDate: Date;
    worksiteId: number | null;
    orderId: number | null; // Proposal ID (from SltProp)
}

export interface ProductionOrderSituation {
    ps_data: string;
    ps_situ: string;
}

export interface ProductionOrderProject {
    ex_sdir: string; // Filename
    dc_path: string; // Path
    // ...
}
