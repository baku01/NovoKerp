import type { ServiceOrder } from '../../stock-position/types';

export interface BmsFilters {
    worksiteId: number;
    startDate: Date;
    endDate: Date;
}

export interface BmsResourceRecord {
    ap_data: string;
    cb_tmdo: string;
    fu_nome: string;
    fu_func: string;
    fu_empr: string;
    id_matr: number;
    id_eqto?: number | null;
    id_ords: number;
    os_nume?: string;
    ap_hent?: number | string | null;
    ap_hiin?: number | string | null;
    ap_htin?: number | string | null;
    ap_hter?: number | string | null;
    ap_feri?: number;
}

export interface BmsHourRate {
    id_ords: number;
    fu_deno: string;
    fu_vlhr: number;
}

export interface BmsJourney {
    id_ords: number;
    id_dsem: number;
    jo_mnts: number;
}

export interface BmsReportRow {
    id: string;
    orderId: number;
    orderName: string;
    date: string;
    resourceType: string;
    resourceName: string;
    resourceFunction: string;
    unitValue: number;
    normalMinutes: number;
    overtimeMinutes: number;
    holidayMinutes: number;
    nightMinutes: number;
    totalValue: number;
    hasRate: boolean;
}

export interface BmsSummary {
    totalRows: number;
    totalHours: number;
    totalValue: number;
    missingRates: number;
}

export interface BuildBmsRowsParams {
    records: BmsResourceRecord[];
    selectedOrderIds: number[];
    hourRates: BmsHourRate[];
    journeys: BmsJourney[];
    orders: ServiceOrder[];
}
