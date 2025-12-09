import { callProcedure, createParam } from '../../api/procedures';
import { StockMovementItem, StockMovementHeader, StockMovementPayload } from './types';
import { apiClient } from '../../api/client'; // Import apiClient

export async function fetchStockItemsForMovement(
    empresa: string,
    header: StockMovementHeader
): Promise<StockMovementItem[]> {
    const params = [
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnIdClie', 'Int', header.id_clie),
        createParam('lcMvTpme', 'VarChar', header.mv_tpme),
        createParam('ldMvData', 'SmallDatetime', header.mv_data),
        createParam('lcMvDpar', 'VarChar', header.mv_dpar),
        createParam('lcFuEmpr', 'VarChar', header.id_empr_func || null),
        createParam('lnFuMatr', 'Int', header.id_matr_func || 0),
        createParam('lnIdOrds', 'Int', header.id_ords || 0),
        createParam('lnCuClie', 'Int', header.id_clie_cost || 0),
    ];
    return callProcedure<StockMovementItem>('pesquisaCadastroEstoqueMovimentacaoEstoque', params);
}

export async function saveStockMovement(
    userId: string,
    empresa: string,
    payload: StockMovementPayload
): Promise<unknown> { // Changed to unknown
    // Construct items string: "a:ID¢b:QTDE¢c:MOTV£..."
    const itemsString = payload.items
        .filter(i => i.mv_qtde > 0)
        .map(i => `a:${i.id_cest}¢b:${i.mv_qtde}¢c:${(i.mv_motv || '').toUpperCase()}`)
        .join('£');

    const params = [
        createParam('lcIdUser', 'VarChar', userId),
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnIdFili', 'Int', 1), // Default fili 1
        createParam('lnIdClie', 'Int', payload.id_clie),
        createParam('lcMvTpme', 'VarChar', payload.mv_tpme),
        createParam('ldMvData', 'SmallDatetime', payload.mv_data),
        createParam('lcMvDpar', 'VarChar', payload.mv_dpar),
        createParam('lcFuEmpr', 'VarChar', payload.id_empr_func || null),
        createParam('lnFuMatr', 'Int', payload.id_matr_func || 0),
        createParam('lnIdOrds', 'Int', payload.id_ords || 0),
        createParam('lcMvObse', 'VarChar', payload.mv_obse),
        createParam('lcMvMvto', 'VarChar', itemsString),
        createParam('lnCuClie', 'Int', payload.id_clie_cost || 0),
        createParam('lcMvLati', 'VarChar', payload.mv_lati || ''),
        createParam('lcMvLong', 'VarChar', payload.mv_long || ''),
        createParam('lnMvFaci', 'Int', 0), // Default 0 for now (no facial auth)
    ];

    return callProcedure('insereMovimentacaoEstoque', params);
}

export async function uploadStockMovementPhoto(
    imageDataUrl: string, // Base64 image
    workPath: string,     // e.g., "facial/EMPRMATR/"
    fileName: string      // e.g., "EMPRMATR.png"
): Promise<unknown> { // Changed to unknown
    const payload = {
        lcBsFoto: imageDataUrl,
        lcWkPath: workPath,
        lcWkFoto: fileName,
    };

    // The legacy code used "insereFoto" as the URL path after the base URL.
    // Assuming the API endpoint is still `/insereFoto`.
    const response = await apiClient.post('/insereFoto', payload);
    return response.data;
}

export async function compareFaces(
    capturedBase64: string,
    referenceBase64: string
): Promise<{ equal: boolean }> {
    const response = await apiClient.post('/comparaFaces', {
        lcBsFot1: capturedBase64,
        lcBsFot2: referenceBase64,
    });
    return { equal: !!response.data?.eh_igua };
}
