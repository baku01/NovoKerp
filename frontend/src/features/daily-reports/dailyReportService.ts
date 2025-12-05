import { callProcedure, createParam, apiClient } from '../../api/procedures';
import { DailyReport, RdoPhoto, RdoFilters } from './types';
import { format } from 'date-fns';

export async function fetchDailyReports(
    empresa: string,
    filters: RdoFilters
): Promise<DailyReport[]> {
    const params = [
        createParam('lcIdUser', 'VarChar', '0'), // User ID often ignored or handled by session
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('ldRoDtde', 'SmallDatetime', filters.startDate ? format(filters.startDate, 'yyyy-MM-dd') : null),
        createParam('ldRoDtat', 'SmallDatetime', filters.endDate ? format(filters.endDate, 'yyyy-MM-dd') : null),
        createParam('lnIdClie', 'Int', filters.worksiteId),
        createParam('lnIdOrds', 'Int', filters.proposalId || null),
    ];
    return callProcedure<DailyReport>('pesquisaRelatoriosDiarioObra', params);
}

export async function fetchPhotos(
    empresa: string,
    report: DailyReport
): Promise<RdoPhoto[]> {
    // Legacy constructs path: "rdos/" + gcIdEmpr + lcIdClie + lcRoData + lcRoOrds
    // ro_data needs to be YYYYMMDD
    const roData = report.ro_data.split('T')[0].replace(/-/g, '');
    const path = `rdos/${empresa}${report.id_clie}${roData}${report.ro_ords.trim()}`;

    const params = [
        createParam('lcPtFoto', 'VarChar', path),
    ];
    
    // Legacy `pesquisaFotos` returns list of filenames (`ex_sdir`).
    // We need to construct full URL.
    // Legacy: goCdUser.ws_wiis.trim() + "fotos/rdos/..."
    // I'll return the filenames and let the component/hook build the URL or build it here if I have the base URL.
    // I'll assume relative path or handle base URL in hook.
    const files = await callProcedure<{ ex_sdir: string }>('pesquisaFotos', params);
    
    // Need base URL for photos. Legacy `goCdUser.ws_wiis`.
    // In modern app, `import.meta.env.VITE_API_URL` points to API.
    // Photos might be on a different static server or same.
    // Let's assume same base URL + 'fotos/'.
    const baseURL = import.meta.env.VITE_API_URL || 'http://www.atscs.com.br/';
    const photoBase = `${baseURL}fotos/${path}/`;

    return files.map(f => ({
        id_clie: report.id_clie,
        ro_data: report.ro_data,
        ro_ords: report.ro_ords,
        nm_foto: f.ex_sdir.trim(),
        ex_sdir: f.ex_sdir.trim(),
        ro_foto: `${photoBase}${f.ex_sdir.trim()}`
    }));
}

export async function uploadPhoto(
    empresa: string,
    report: DailyReport,
    base64Data: string // "data:image/png;base64,..."
): Promise<boolean> {
    const roData = report.ro_data.split('T')[0].replace(/-/g, '');
    const path = `rdos/${empresa}${report.id_clie}${roData}${report.ro_ords.trim()}/`;
    const fileName = Math.random().toString(36).substring(7) + ".png";

    // Legacy calls `insereFoto` endpoint (not a procedure, but a POST route?)
    // `$.ajax({ url: goCdUser.ws_http.trim() + "insereFoto", ... })`
    // It seems to be a custom endpoint, not the `chamadaProcedure`.
    
    try {
        const response = await apiClient.post('insereFoto', {
            lcBsFoto: base64Data,
            lcWkPath: path,
            lcWkFoto: fileName
        });
        return response.data?.ft_inse === true;
    } catch (error) {
        console.error("Upload failed", error);
        return false;
    }
}

export async function deletePhoto(
    empresa: string,
    report: DailyReport,
    fileName: string
): Promise<boolean> {
    const roData = report.ro_data.split('T')[0].replace(/-/g, '');
    const path = `rdos/${empresa}${report.id_clie}${roData}${report.ro_ords.trim()}/`;

    try {
        const response = await apiClient.post('insereFoto', {
            lcBsFoto: "", // Empty body for delete? Legacy: `lcBsFoto: ""`
            lcWkPath: path,
            lcWkFoto: fileName
        });
        return response.data?.ft_inse === true;
    } catch (error) {
        console.error("Delete failed", error);
        return false;
    }
}
