import { describe, it, expect } from 'vitest';
import {
    createTransferRequest,
    addTransferItem,
    deleteTransfer,
    updateTransferStatus,
    createReturn,
    updateReturn,
    deleteReturn,
} from './transferActions';

const USER_ID = 'TESTUSER';
const EMPRESA = 'EMPR1';

describe('transferActions (stock transfers/returns)', () => {
    it('creates a transfer request and returns an id', async () => {
        const result = await createTransferRequest(USER_ID, EMPRESA, {
            worksiteId: 1,
            neededDate: '2025-01-10',
            notes: 'Teste',
            items: [
                { id_cest: 10, quantity: 5, unitCost: 12.5, motive: 'Reposição' },
                { id_cest: 11, quantity: 2, unitCost: 8 },
            ],
        });

        expect(result.id_strf).toBeTruthy();
    });

    it('adds an extra transfer item', async () => {
        await expect(
            addTransferItem(USER_ID, EMPRESA, 9001, 1, '2025-01-10', 'Obs', {
                id_cest: 12,
                quantity: 3,
                unitCost: 9,
                motive: 'Complemento',
            })
        ).resolves.toBeDefined();
    });

    it('updates transfer status (send)', async () => {
        await expect(
            updateTransferStatus(USER_ID, EMPRESA, 'send', {
                transferId: 9001,
                worksiteId: 1,
                sendDate: '2025-01-12',
                receiveDate: null,
            })
        ).resolves.toBeDefined();
    });

    it('deletes a transfer', async () => {
        await expect(deleteTransfer(EMPRESA, 9001)).resolves.toBeDefined();
    });

    it('creates a stock return', async () => {
        const result = await createReturn(USER_ID, EMPRESA, {
            worksiteId: 2,
            returnDate: '2025-01-05',
            items: [{ id_cest: 20, quantity: 1, unitCost: 5, motive: 'Devolução' }],
        });

        expect(result.id_dves).toBeTruthy();
    });

    it('updates a return (send)', async () => {
        await expect(updateReturn(USER_ID, EMPRESA, 8001, 2, 'send')).resolves.toBeDefined();
    });

    it('deletes a return', async () => {
        await expect(deleteReturn(EMPRESA, 8001)).resolves.toBeDefined();
    });
});
