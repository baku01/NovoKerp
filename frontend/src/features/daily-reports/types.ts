export interface DailyReport {
    id_clie: number;
    cl_fant: string;
    ro_data: string; // Date
    ro_ords: string; // Service Order IDs string? e.g. "123, 124"
    ro_nume: string; // Proposal Numbers?
    // Legacy has: id_clie, ro_data, ro_ords, cl_fant, ro_nume
}

export interface RdoPhoto {
    id_clie: number;
    ro_data: string;
    ro_ords: string;
    ro_foto: string; // Full URL
    nm_foto: string; // Filename
    ex_sdir: string; // Filename from DB
}

export interface RdoFilters {
    startDate: Date | null;
    endDate: Date | null;
    worksiteId: number | null;
    proposalId?: number | null; // 'id_ords' in legacy
}
