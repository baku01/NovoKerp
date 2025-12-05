export interface ServiceOrderDetails {
    cl_fant: string;
    os_nume: string;
    os_tipo: number; // 1=Empreita, 2=Hora Homem, etc.
    os_resp: string;
    oc_nume: string;
    os_ncli: string;
    os_ncon: string;
    os_desc: string;
    os_situ: string;
    re_hrap: number; // Horas Realizadas (Apontadas)
    // Planned hours fields depend on the dropdown selection in legacy (Total, Mão de Obra, etc.)
    // Legacy defaults to checking 'OC_QTHR' (Orçadas) or others.
    oc_qthr: number; // Orçadas Total
    mp_qthr: number; // Mão de Obra Planejada
    mi_qthr: number; // Material Planejado ?
    eq_qthr: number; // Equipamento Planejado ?
    os_pcon: number; // % Conclusão Física
    os_dtpc: string; // Data Atualização
    os_uspc: string; // Usuário Atualização
}

export interface InternalAppointment {
    cl_fant: string;
    re_hrap: number;
}

export interface AppointmentStatus {
    sr_deno: string;
    re_hrap: number;
}

export interface StoppedAppointment {
    ju_deno: string;
    re_hrap: number;
    re_hace: string; // Contratante?
}

export interface PlannedRealizedComparison {
    // Planejado vs Realizado fields
    // Mão de Obra
    os_mdpl: number; // Planejado
    fu_hamd: number; // Realizado
    
    // Material? (Legacy vars: os_mipl, fu_hami)
    os_mipl: number;
    fu_hami: number;

    // Equipamento
    os_eqpl: number;
    eq_hrap: number;

    // Alternative fields if type is Orçado (OC_QTHR)
    mp_qthr: number;
    mi_qthr: number;
    eq_qthr: number;
}

export interface WorkShift {
    id_dsem: number; // Dia Semana (1-7?)
    id_ords: number;
    jo_mnts: number; // Jornada em Minutos
}

export interface AppointmentRecord {
    ap_data: string;
    fu_empr: string;
    id_matr: number;
    id_ords: number;
    ap_hent: number; // Hora Entrada (Decimal like 7.5 = 7:30?) or string "HH.MM"? Legacy splits by "."
    ap_hiin: number; // Hora Inicio Intervalo
    ap_htin: number; // Hora Termino Intervalo
    ap_hter: number; // Hora Termino
    ap_feri: number; // Feriado? > 0
    // Helper for calculation
    ap_jdms?: number; // Jornada do Mês? (Calculated)
}
