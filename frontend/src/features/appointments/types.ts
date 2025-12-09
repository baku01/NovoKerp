export interface AppointmentResource {
    id_matr: number;
    fu_nome: string;
    fu_func: string;
    fu_empr: string;
    cb_tmdo: string; // 'EQP' or 'OPE'/'ADM'
    
    // Checkbox state in UI
    checked?: boolean;
}

export interface AppointmentActivity {
    id_ativ: number;
    at_deno: string; // Description
    at_tipo: string; // 'A' (Activity) or 'T' (Task/Exclusion?)
    id_excl?: number;
    ta_codi?: string; // Task Code
    ap_dres?: number; // Days remaining (from previous appointment?)
    at_dres?: number; // Default days remaining
}

export interface AppointmentComment {
    cm_desc: string;
    // Add other fields if legacy `consultaComentario` returns more
}

export interface TaskUpdateInput {
    id_ords: number;
    id_excl: number;
    id_ativ: number;
    ap_dres: number;
}

export interface AppointmentStatusOption {
    id_sirc: number; // Situation Resource ID
    sr_deno: string; // Description (e.g. "TRABALHANDO", "FALTA")
    sr_trab: number; // Is working? (1/0)
    sr_just: number; // Requires justification? (1/0)
}

export interface Justification {
    id_just: number;
    ju_deno: string;
}

export interface Responsibility {
    id_rpju: number;
    rj_deno: string;
}

export interface AppointmentPayload {
    id_apnt?: number;
    id_clie: number;
    ap_data: string; // Date
    id_strc: number; // Status Resource
    id_jflt?: number; // Justification Fault?
    ap_obsr?: string; // Observation Status
    id_ords: number;
    
    // Hours (Decimal)
    ap_hent?: number;
    ap_hiin?: number;
    ap_htin?: number;
    ap_hter?: number;
    
    id_sirc?: number;
    id_just?: number;
    ap_obju?: string; // Observation Justification
    id_rpju?: number; // Responsibility ID
    
    id_ativ?: number;
    id_excl?: number;
    ap_dres?: number; // Days remaining
    ap_datv?: string; // Description Activity
    
    ap_feri?: number; // Holiday?
    
    // Lists of resources (Comma or Pipe separated in legacy)
    ids_matr: string; // "123EMPRESA, 456OUTRA"
    ids_eqto: string; // "789, 101"
}

export interface EmailConfig {
    to: string;
    subject: string;
    body: string; // HTML
}

export interface AppointmentResult {
    id_apnt: number;
}
