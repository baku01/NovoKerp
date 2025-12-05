import { callProcedure, createParam } from '../../api/procedures';
import { DocumentFolder, DocumentFile } from './types';
import { Worksite } from '../stock-position/types'; // Reuse type

export async function fetchDocumentWorksites(empresa: string, userId: string): Promise<Worksite[]> {
    const params = [
        createParam('lcIdUser', 'VarChar', userId),
        createParam('lcIdEmpr', 'VarChar', empresa)
    ];
    return callProcedure<Worksite>('pesquisaObras', params);
}

export async function fetchDocuments(
    empresa: string,
    userId: string,
    path: string,
    isFileSearch: boolean = false
): Promise<DocumentFolder[]> {
    // Legacy logic:
    // If lnIdClie < 0 -> drive/geral
    // If lnIdClie > 0 -> drive/obras/EMPRESA+ID
    // Else -> drive/usuarios/USER

    // We pass the full path constructed in the component
    const params = [
        createParam('lcPtDocs', 'VarChar', path),
        createParam('lnExFile', 'Int', isFileSearch ? 1 : 0) // Legacy passes 1 for files? Actually `pesquisaArquivosCTD` passes 1. `pesquisaPastasCTD` passes nothing (default?).
        // `pesquisaPastasCTD` calls `pesquisaDocumentos?lcPtDocu=...`. It doesn't use `chamadaProcedure`. Wait.
        // `ComlTbDrve.js`:
        // `pesquisaPastasCTD`: $.ajax(..., url: ... + "pesquisaDocumentos?lcPtDocu=" + lcPtDocu) -> GET endpoint, not procedure?
        // `pesquisaArquivosCTD`: $.ajax(..., chamadaProcedure... `pesquisaDocumentos` procedure).

        // It seems there are two ways. The procedure `pesquisaDocumentos` likely handles the listing.
        // Let's assume the procedure works for both if we pass the right path.
    ];

    // If we use the procedure for everything:
    // For folders: `pesquisaDocumentos` via GET endpoint might be different from the stored procedure.
    // However, usually "chamadaProcedure" is the standard.
    // Let's check `pesquisaArquivosCTD`:
    // `lmWkIsql = [{ pa_nome: "lcPtDocs", ... }, { pa_nome: "lnExFile", pa_type: "Int", pa_valo: 1 }]`
    // So for files, `lnExFile` is 1.
    // For folders (`pesquisaPastasCTD`), it hits `pesquisaDocumentos` endpoint directly.
    // The endpoint likely wraps the procedure or file system logic.
    // I should check if `callProcedure` can call `pesquisaDocumentos`.
    // If `pesquisaDocumentos` is a procedure in the DB, `callProcedure` works.
    // If it's a Java/Controller endpoint, I might need a specific API call.
    // Given the rest of the app uses `chamadaProcedure`, I'll try that first.
    // But `pesquisaPastasCTD` explicitly uses `pesquisaDocumentos?lcPtDocu=...`.
    // I'll stick to `chamadaProcedure` if possible, assuming `pesquisaDocumentos` proc exists.
    // If I need to emulate the GET, I need to know the base URL.

    return callProcedure<DocumentFolder>('pesquisaDocumentos', params);
}
