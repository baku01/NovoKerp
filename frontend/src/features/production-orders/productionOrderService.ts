import { callProcedure, createParam } from '../../api/procedures';
import { ProductionOrder, ProductionOrderItem, ProductionOrderFilter, ProductionOrderSituation, ProductionOrderProject } from './types';
import { format } from 'date-fns';

export async function fetchProductionOrders(
    empresa: string,
    filters: ProductionOrderFilter
): Promise<ProductionOrder[]> {
    const params = [
        createParam('lcIdUser', 'VarChar', '0'),
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('ldDrDtde', 'SmallDatetime', format(filters.startDate, 'yyyy-MM-dd')),
        createParam('ldDrDtat', 'SmallDatetime', format(filters.endDate, 'yyyy-MM-dd')),
        createParam('lnIdClie', 'Int', filters.worksiteId),
        createParam('lnIdOrds', 'Int', filters.orderId),
    ];
    return callProcedure<ProductionOrder>('pesquisaOrdensServicoProducao', params);
}

export async function fetchProductionOrderItems(
    empresa: string,
    poNum: number
): Promise<ProductionOrderItem[]> {
    const params = [
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnPoNume', 'Int', poNum),
    ];
    return callProcedure<ProductionOrderItem>('pesquisaItensOrdemServicoProducao', params);
}

export async function fetchProductionOrderSituations(
    empresa: string,
    poNum: number
): Promise<ProductionOrderSituation[]> {
    const params = [
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnPoNume', 'Int', poNum),
    ];
    return callProcedure<ProductionOrderSituation>('pesquisaSituacoesOrdemServicoProducao', params);
}

export async function fetchProductionOrderProjects(
    // poNum: number
): Promise<ProductionOrderProject[]> {
    // Legacy uses `pesquisaDocumentos` (servlet/endpoint?), not a procedure via `chamadaProcedure`.
    // "pesquisaDocumentos?lcPtDocu=OrdensServicoProducao/..."
    // I'll assume I can fetch this or mock it if it's a file listing.
    // For now, let's define the interface but the implementation depends on the backend route `pesquisaDocumentos`.
    // It's likely a GET request.
    
    // TODO: Implement `apiClient.get('pesquisaDocumentos', ...)`
    return []; // Placeholder
}
