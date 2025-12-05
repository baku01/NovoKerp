import { callProcedure, createParam } from '../../api/procedures';

export interface PremiumHourRecord {
    id_hrpr: number;
    id_clie: number;
    ah_data: string; // Date
    ah_hora: number; // Decimal time (e.g. 1.30 for 1:30)
    ah_desc: string;
    id_user: string;
    ah_erro?: string; // Error message from procedure if any
}

export async function insertPremiumHour(
    userId: string,
    empresa: string,
    idClie: number,
    positionDate: string, // "Data da Posição" (Reference date?)
    date: string,
    hours: number, // Decimal
    description: string
): Promise<PremiumHourRecord[]> {
    const params = [
        createParam('lcIdUser', 'VarChar', userId),
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnIdClie', 'Int', idClie),
        createParam('ldPsData', 'SmallDatetime', positionDate),
        createParam('ldAhData', 'SmallDatetime', date),
        createParam('lnAhHora', 'Decimal', hours),
        createParam('lcAhDesc', 'VarChar', description),
    ];
    return callProcedure<PremiumHourRecord>('insereHoraPremio', params);
}

export async function deletePremiumHour(
    userId: string,
    empresa: string,
    idHrpr: number,
    idClie: number,
    date: string
): Promise<PremiumHourRecord[]> {
    const params = [
        createParam('lcIdUser', 'VarChar', userId),
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnIdHrpr', 'Int', idHrpr),
        createParam('lnIdClie', 'Int', idClie),
        createParam('ldAhData', 'SmallDatetime', date),
    ];
    return callProcedure<PremiumHourRecord>('deletaHoraPremio', params);
}
