import { callProcedure, createParam } from '../../api/procedures';
import { apiClient } from '../../api/client';
import { 
    ProductionOrder, 
    ProductionOrderItem, 
    ProductionOrderFilter, 
    ProductionOrderSituation, 
    ProductionOrderProject,
    ProductionOrderInput,
    ProductionOrderUpdateInput,
    ProductionOrderItemInput
} from './types';
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
    poNum: number
): Promise<ProductionOrderProject[]> {
    const params = [
        createParam('lcPtDocs', 'VarChar', `OrdensServicoProducao/${poNum}`),
        createParam('lnExFile', 'Int', 1) 
    ];
    return callProcedure<ProductionOrderProject>('pesquisaDocumentos', params);
}

// Mutations

export async function insertProductionOrder(
    empresa: string,
    userId: string,
    data: ProductionOrderInput
): Promise<ProductionOrder[]> {
    const params = [
        createParam('lcIdUser', 'VarChar', userId),
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnIdClie', 'Int', data.id_clie),
        createParam('lcOsNume', 'VarChar', data.os_nume),
        createParam('lcPoDesc', 'VarChar', data.po_desc),
        createParam('lcPoPlan', 'VarChar', data.po_plan),
        createParam('lcPoSoli', 'VarChar', data.po_soli),
        createParam('ldPoDtnc', 'SmallDatetime', format(data.po_dtnc, 'yyyy-MM-dd')),
        createParam('ldPoDtpi', 'SmallDatetime', format(data.po_dtpi, 'yyyy-MM-dd')),
        createParam('lnPoHrdi', 'Decimal', data.po_hrdi),
        createParam('lcPsSitu', 'VarChar', data.ps_situ || ''),
        createParam('lcPiDesc', 'VarChar', data.pi_desc || '')
    ];
    return callProcedure<ProductionOrder>('insereOrdemServicoProducao', params);
}

export async function updateProductionOrder(
    empresa: string,
    userId: string,
    data: ProductionOrderUpdateInput
): Promise<ProductionOrder[]> {
    const params = [
        createParam('lcIdUser', 'VarChar', userId),
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnPoNume', 'Int', data.po_nume),
        createParam('lcPoDesc', 'VarChar', data.po_desc),
        createParam('lcPoPlan', 'VarChar', data.po_plan),
        createParam('lcPoSoli', 'VarChar', data.po_soli),
        createParam('ldPoDtnc', 'SmallDatetime', format(data.po_dtnc, 'yyyy-MM-dd')),
        createParam('ldPoDtpi', 'SmallDatetime', format(data.po_dtpi, 'yyyy-MM-dd')),
        createParam('lnPoHrdi', 'Decimal', data.po_hrdi)
    ];
    return callProcedure<ProductionOrder>('atualizaInformacoesOrdemServicoProducao', params);
}

export async function deleteProductionOrder(
    empresa: string,
    userId: string,
    poNum: number
): Promise<void> {
    const params = [
        createParam('lcIdUser', 'VarChar', userId),
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnPoNume', 'Int', poNum)
    ];
    await callProcedure('deletaOrdemServicoProducao', params);
}

export async function insertProductionOrderItem(
    empresa: string,
    userId: string,
    // We need header data too because the SP seems to require it or updates it
    header: ProductionOrderUpdateInput, 
    item: ProductionOrderItemInput
): Promise<ProductionOrder[]> {
    const params = [
        createParam('lcIdUser', 'VarChar', userId),
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnPoNume', 'Int', header.po_nume),
        createParam('lcPoDesc', 'VarChar', header.po_desc),
        createParam('lcPoPlan', 'VarChar', header.po_plan),
        createParam('lcPoSoli', 'VarChar', header.po_soli),
        createParam('ldPoDtnc', 'SmallDatetime', format(header.po_dtnc, 'yyyy-MM-dd')),
        createParam('ldPoDtpi', 'SmallDatetime', format(header.po_dtpi, 'yyyy-MM-dd')),
        createParam('lnPoHrdi', 'Decimal', header.po_hrdi),
        createParam('lnIdItem', 'Int', item.id_item || 0),
        createParam('lcPiDesc', 'VarChar', item.pi_desc)
    ];
    return callProcedure<ProductionOrder>('insereItemOrdemServicoProducao', params);
}

export async function deleteProductionOrderItem(
    empresa: string,
    userId: string,
    poNum: number,
    itemId: number
): Promise<ProductionOrder[]> {
    const params = [
        createParam('lcIdUser', 'VarChar', userId),
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnPoNume', 'Int', poNum),
        createParam('lnIdItem', 'Int', itemId)
    ];
    return callProcedure<ProductionOrder>('deletaItemOrdemServicoProducao', params);
}

export async function insertProductionOrderSituation(
    empresa: string,
    userId: string,
    poNum: number,
    situation: string
): Promise<ProductionOrderSituation[]> {
    const params = [
        createParam('lcIdUser', 'VarChar', userId),
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnPoNume', 'Int', poNum),
        createParam('lcPsSitu', 'VarChar', situation)
    ];
    return callProcedure<ProductionOrderSituation>('insereSituacaoOrdemServicoProducao', params);
}

export async function deleteProductionOrderSituation(
    empresa: string,
    userId: string,
    poNum: number,
    date: Date,
    situation: string
): Promise<ProductionOrderSituation[]> {
    const params = [
        createParam('lcIdUser', 'VarChar', userId),
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnPoNume', 'Int', poNum),
        createParam('ldPsData', 'SmallDatetime', format(date, 'yyyy-MM-dd HH:mm:ss')), // Timestamp? Legacy: objetoDataParaStringSqlData
        createParam('lcPsSitu', 'VarChar', situation)
    ];
    return callProcedure<ProductionOrderSituation>('deletaSituacaoOrdemServicoProducao', params);
}

export async function uploadProductionOrderProject(
    poNum: number,
    file: File
): Promise<void> {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
        reader.onload = async () => {
            try {
                const base64 = (reader.result as string).split(',')[1];
                await apiClient.post('insereDocumento', {
                    lcDcBase: base64,
                    lcDcPath: `OrdensServicoProducao/${poNum}/`,
                    lcDcNome: file.name
                });
                resolve();
            } catch (e) {
                reject(e);
            }
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

export async function deleteProductionOrderProject(
    poNum: number,
    fileName: string
): Promise<void> {
    await apiClient.get(`deletaDocumento?lcPtDocu=OrdensServicoProducao/${poNum}&lcExSdir=/${fileName}`);
}

