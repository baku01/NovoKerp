import { createParam, callProcedure } from '../../api/procedures';
import {
    ReturnRequestInput,
    TransferRequestInput,
    TransferStatusUpdate,
    TransferItemInput,
    ReturnItemInput,
} from './types';

/**
 * Creates a transfer request and its items.
 * Legacy flow: first item via `insereSolicitacaoTransferencia`, remaining via `insereCadastroEstoqueSolicitacaoTransferencia`.
 */
export async function createTransferRequest(
    userId: string,
    empresa: string,
    input: TransferRequestInput
): Promise<{ id_strf: number }> {
    if (!input.items.length) {
        throw new Error('Selecione ao menos um item para transferência');
    }

    const [first, ...rest] = input.items;
    const params = [
        createParam('lcIdUser', 'VarChar', userId),
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnIdClie', 'Int', input.worksiteId),
        createParam('lnIdSitu', 'Int', 1),
        createParam('ldSlDnec', 'SmallDatetime', input.neededDate),
        createParam('lcApUser', 'VarChar', ''),
        createParam('ldApData', 'SmallDatetime', ''),
        createParam('lcSlUenv', 'VarChar', ''),
        createParam('ldSlDenv', 'SmallDatetime', '1900-01-01'),
        createParam('ldSlDrec', 'SmallDatetime', '1900-01-01'),
        createParam('lcSlObse', 'VarChar', input.notes || ''),
        createParam('lnIdCest', 'Int', first.id_cest),
        createParam('lnSmQtde', 'Decimal', first.quantity),
        createParam('lcSmMotv', 'VarChar', first.motive || ''),
    ];

    const [created] = await callProcedure<{ id_strf: number }>('insereSolicitacaoTransferencia', params);
    if (!created?.id_strf) throw new Error('Falha ao criar solicitação de transferência');

    if (rest.length) {
        await Promise.all(
            rest.map((item) =>
                callProcedure('insereCadastroEstoqueSolicitacaoTransferencia', [
                    createParam('lcIdUser', 'VarChar', userId),
                    createParam('lcIdEmpr', 'VarChar', empresa),
                    createParam('lnIdStrf', 'Int', created.id_strf),
                    createParam('lnIdClie', 'Int', input.worksiteId),
                    createParam('ldSlDnec', 'SmallDatetime', input.neededDate),
                    createParam('lcSlObse', 'VarChar', input.notes || ''),
                    createParam('lnIdCest', 'Int', item.id_cest),
                    createParam('lnSmQtde', 'Decimal', item.quantity),
                    createParam('lcSmMotv', 'VarChar', item.motive || ''),
                ])
            )
        );
    }

    return { id_strf: created.id_strf };
}

export async function addTransferItem(
    userId: string,
    empresa: string,
    transferId: number,
    worksiteId: number,
    neededDate: string,
    notes: string | undefined,
    item: TransferItemInput
) {
    return callProcedure('insereCadastroEstoqueSolicitacaoTransferencia', [
        createParam('lcIdUser', 'VarChar', userId),
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnIdStrf', 'Int', transferId),
        createParam('lnIdClie', 'Int', worksiteId),
        createParam('ldSlDnec', 'SmallDatetime', neededDate),
        createParam('lcSlObse', 'VarChar', notes || ''),
        createParam('lnIdCest', 'Int', item.id_cest),
        createParam('lnSmQtde', 'Decimal', item.quantity),
        createParam('lcSmMotv', 'VarChar', item.motive || ''),
    ]);
}

export async function deleteTransfer(empresa: string, transferId: number) {
    return callProcedure('deletaSolicitacaoTransferencia', [
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnIdStrf', 'Int', transferId),
    ]);
}

type TransferAction =
    | 'update'
    | 'contest'
    | 'send'
    | 'resend'
    | 'finalize';

const transferActionToProcedure: Record<TransferAction, string> = {
    update: 'atualizaSolicitacaoTransferencia',
    contest: 'atualizaContestaSolicitacaoTransferencia',
    send: 'atualizaEnviaSolicitacaoTransferencia',
    resend: 'atualizaReenviaSolicitacaoTransferencia',
    finalize: 'atualizaFinalizaSolicitacaoTransferencia',
};

export async function updateTransferStatus(
    userId: string,
    empresa: string,
    action: TransferAction,
    data: TransferStatusUpdate
) {
    const proc = transferActionToProcedure[action];
    return callProcedure(proc, [
        createParam('lcIdUser', 'VarChar', userId),
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnIdStrf', 'Int', data.transferId),
        createParam('lnIdClie', 'Int', data.worksiteId),
        createParam('lcSlObse', 'VarChar', data.notes || ''),
        createParam('ldSlDenv', 'SmallDatetime', data.sendDate || null),
        createParam('ldSlDrec', 'SmallDatetime', data.receiveDate || null),
    ]);
}

// -------------------- DEVOLUÇÃO --------------------

export async function createReturn(
    userId: string,
    empresa: string,
    input: ReturnRequestInput
): Promise<{ id_dves: number }> {
    if (!input.items.length) {
        throw new Error('Selecione ao menos um item para devolução');
    }

    const [first, ...rest] = input.items;
    const params = [
        createParam('lcIdUser', 'VarChar', userId),
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnIdClie', 'Int', input.worksiteId),
        createParam('lnIdSitu', 'Int', 1),
        createParam('ldDlData', 'SmallDatetime', input.returnDate),
        createParam('lnIdCest', 'Int', first.id_cest),
        createParam('lnDlQtde', 'Decimal', first.quantity),
        createParam('lcDlMotv', 'VarChar', first.motive || ''),
        createParam('lcDlObse', 'VarChar', input.notes || ''),
    ];

    const [created] = await callProcedure<{ id_dves: number }>('insereDevolucaoEstoque', params);
    if (!created?.id_dves) throw new Error('Falha ao criar devolução de estoque');

    if (rest.length) {
        await Promise.all(
            rest.map((item: ReturnItemInput) =>
                callProcedure('insereCadastrosEstoqueDevolucaoEstoque', [
                    createParam('lcIdUser', 'VarChar', userId),
                    createParam('lcIdEmpr', 'VarChar', empresa),
                    createParam('lnIdDves', 'Int', created.id_dves),
                    createParam('lnIdClie', 'Int', input.worksiteId),
                    createParam('ldDlData', 'SmallDatetime', input.returnDate),
                    createParam('lnIdCest', 'Int', item.id_cest),
                    createParam('lnDlQtde', 'Decimal', item.quantity),
                    createParam('lcDlMotv', 'VarChar', item.motive || ''),
                    createParam('lcDlObse', 'VarChar', input.notes || ''),
                ])
            )
        );
    }

    return { id_dves: created.id_dves };
}

export async function updateReturn(
    userId: string,
    empresa: string,
    returnId: number,
    worksiteId: number,
    action: 'update' | 'send'
) {
    const proc = action === 'send' ? 'atualizaEnviaDevolucaoEstoque' : 'atualizaDevolucaoEstoque';
    return callProcedure(proc, [
        createParam('lcIdUser', 'VarChar', userId),
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnIdDves', 'Int', returnId),
        createParam('lnIdClie', 'Int', worksiteId),
    ]);
}

export async function deleteReturn(empresa: string, returnId: number) {
    return callProcedure('deletaDevolucaoEstoque', [
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnIdDves', 'Int', returnId),
    ]);
}
