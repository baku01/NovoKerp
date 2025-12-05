import { callProcedure, createParam } from '../../api/procedures';
import { DocumentFolder } from './types';
import { Worksite } from '../stock-position/types';

export async function fetchDocumentWorksites(empresa: string, userId: string): Promise<Worksite[]> {
    const params = [
        createParam('lcIdUser', 'VarChar', userId),
        createParam('lcIdEmpr', 'VarChar', empresa)
    ];
    return callProcedure<Worksite>('pesquisaObras', params);
}

export async function fetchDocuments(
    _empresa: string,
    _userId: string,
    path: string,
    isFileSearch: boolean = false
): Promise<DocumentFolder[]> {
    const params = [
        createParam('lcPtDocs', 'VarChar', path),
        createParam('lnExFile', 'Int', isFileSearch ? 1 : 0)
    ];

    return callProcedure<DocumentFolder>('pesquisaDocumentos', params);
}
