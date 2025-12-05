export interface PurchaseOrder {
    id_pcom: number;
    pc_nume: string;
    pc_data: string; // Date
    pc_dtpe: string; // Predicted Delivery Date
    pc_dten: string; // Delivery Date
    ca_nome: string; // Supplier Name
    pc_qtde: number;
    pc_tota: number; // Total Value
    pc_user: string; // User
    ap_user: string; // Approval User
    ap_data: string; // Approval Date
    pc_obse: string; // Observation
    st_deno: string; // Status Description
    us_fxde: number; // Approval Lower Limit?
    us_fxat: number; // Approval Upper Limit?
}

export interface PurchaseOrderItem {
    id_sequ: number;
    ce_codi: string;
    ce_deno: string; // Item Name
    pc_deno: string; // Item Name Override?
    pc_uncr: string; // Unit
    pc_qtde: number;
    pc_prun: number; // Unit Price
    pc_vdes: number; // Discount
    pc_pipi: number; // IPI %
    pc_picm: number; // ICMS %
    cc_deno: string; // Cost Center / Worksite Name?
}

export interface PurchasingFilters {
    startDate: Date | null;
    endDate: Date | null;
    paramType: 'PC_DATA' | 'PC_DTEN'; // Date Filter Type (Creation or Delivery)
    status: number; // 1=Approved, 2=Disapproved, etc.
    worksiteId: number | null;
    description: string;
}
