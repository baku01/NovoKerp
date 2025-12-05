import { callProcedure, createParam } from '../../api/procedures';
import { PurchaseOrder, PurchaseOrderItem, PurchasingFilters } from './types';
import { format } from 'date-fns';

export async function fetchPurchaseOrders(
    empresa: string,
    filters: PurchasingFilters
): Promise<PurchaseOrder[]> {
    // Map filter type to params
    // Legacy logic: if 'PC_DATA', fill ldPcDtde/Dtat. if 'PC_DTEN', fill ldPcDede/Deat.
    let dtde: string | null = null;
    let dtat: string | null = null;
    let dede: string | null = null;
    let deat: string | null = null;

    if (filters.startDate && filters.endDate) {
        const s = format(filters.startDate, 'yyyy-MM-dd');
        const e = format(filters.endDate, 'yyyy-MM-dd');
        if (filters.paramType === 'PC_DATA') {
            dtde = s;
            dtat = e;
        } else {
            dede = s;
            deat = e;
        }
    }

    const params = [
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('ldPcDtde', 'SmallDatetime', dtde),
        createParam('ldPcDtat', 'SmallDatetime', dtat),
        createParam('ldPcDede', 'SmallDatetime', dede),
        createParam('ldPcDeat', 'SmallDatetime', deat),
        createParam('lnApSitu', 'Int', filters.status),
        createParam('lnIdClie', 'Int', filters.worksiteId),
        createParam('lcCeDeno', 'VarChar', filters.description || null),
    ];
    return callProcedure<PurchaseOrder>('pesquisaPedidosCompra', params);
}

export async function fetchPurchaseOrderItems(
    idPcom: number
): Promise<PurchaseOrderItem[]> {
    const params = [
        createParam('lnIdPcom', 'Int', idPcom)
    ];
    return callProcedure<PurchaseOrderItem>('pesquisaItensPedidoCompra', params);
}

export async function approvePurchaseOrder(
    userId: string,
    empresa: string,
    ids: number[]
): Promise<any> {
    // Legacy passes comma separated IDs in `lcIdPcom`
    const idList = ids.join(', ');
    const params = [
        createParam('lcIdUser', 'VarChar', userId),
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lcIdPcom', 'VarChar', idList),
        // Other params seem to be for refreshing the list after update in legacy,
        // but typically we just want to perform the action.
        // Legacy sends ALL filters again to `atualizaAprovaPedidoCompra`.
        // I'll send nulls for filters, assuming the procedure handles "Action + Refresh" or just "Action".
        // If it's just Action, nulls are fine. If it returns refreshed list based on filters, we might miss data.
        // Ideally we refetch using `useQuery` after mutation.
        // Let's try sending minimal params required for update.
        // The procedure name `atualizaAprovaPedidoCompra` suggests update.
        // Params: lcIdUser, lcIdEmpr, lcIdPcom ... filters ...
        // If filters are optional for the update itself, good.
        createParam('ldPcDtde', 'SmallDatetime', null),
        createParam('ldPcDtat', 'SmallDatetime', null),
        createParam('ldPcDede', 'SmallDatetime', null),
        createParam('ldPcDeat', 'SmallDatetime', null),
        createParam('lnApSitu', 'Int', 0),
        createParam('lnIdClie', 'Int', 0),
        createParam('lcCeDeno', 'VarChar', null),
    ];
    return callProcedure('atualizaAprovaPedidoCompra', params);
}

export async function disapprovePurchaseOrder(
    userId: string,
    empresa: string,
    ids: number[]
): Promise<any> {
    const idList = ids.join(', ');
    const params = [
        createParam('lcIdUser', 'VarChar', userId),
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lcIdPcom', 'VarChar', idList),
        createParam('ldPcDtde', 'SmallDatetime', null),
        createParam('ldPcDtat', 'SmallDatetime', null),
        createParam('ldPcDede', 'SmallDatetime', null),
        createParam('ldPcDeat', 'SmallDatetime', null),
        createParam('lnApSitu', 'Int', 0),
        createParam('lnIdClie', 'Int', 0),
        createParam('lcCeDeno', 'VarChar', null),
    ];
    return callProcedure('atualizaDesaprovaPedidoCompra', params);
}
