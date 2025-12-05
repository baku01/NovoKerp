export interface ServiceOrderProgress {
    os_pcon: number; // % Conclusão
    os_pcci: number; // % Conclusão Interna?
    os_dtpc: string; // Data Perc
    os_uspc: string; // User Perc
    os_dpci: string; // Data Perc Interna
    os_upci: string; // User Perc Interna
    
    // Gauges data from `consultaAndamentoOS`
    os_hrap: number; // Horas Apontadas
    os_hroc: number; // Horas Orçadas
    
    mp_qthr: number; // Mão Obra Planejada
    mi_qthr: number; // Material Planejada
    eq_qthr: number; // Equipamento Planejada
    
    os_mdpl: number;
    os_mipl: number;
    os_eqpl: number;
    
    ap_hrmd: number; // Realizado MO
    ap_hrmi: number; // Realizado Mat
    ap_hreq: number; // Realizado Eqp
    
    ap_data: string; // Last appointment date
}

export interface ServiceOrderSituation {
    os_data: string;
    os_situ: string;
}
