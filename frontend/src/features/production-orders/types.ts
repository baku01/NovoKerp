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

export interface ProductionOrderInput {
    id_clie: number;
    os_nume: string;
    po_desc: string;
    po_plan: string;
    po_soli: string;
    po_dtnc: Date;
    po_dtpi: Date;
    po_hrdi: number;
    ps_situ?: string;
    pi_desc?: string; // Initial item description
}

export interface ProductionOrderUpdateInput {
    po_nume: number;
    po_desc: string;
    po_plan: string;
    po_soli: string;
    po_dtnc: Date;
    po_dtpi: Date;
    po_hrdi: number;
}

export interface ProductionOrderItem {
    id_item: number;
    po_nume: number;
    pi_desc: string; // Description
}

export interface ProductionOrderItemInput {
    po_nume: number;
    pi_desc: string;
    id_item?: number; // If updating? Legacy only has insert, delete? Legacy `insereItem` handles both insert (id=0) and maybe update? Legacy `insereItem` checks `lnIdItem` param.
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
