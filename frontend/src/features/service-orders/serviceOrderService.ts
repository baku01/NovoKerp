import { callProcedure, createParam } from '../../api/procedures';
import {
    ServiceOrderDetails,
    InternalAppointment,
    AppointmentStatus,
    StoppedAppointment,
    PlannedRealizedComparison,
    WorkShift,
    AppointmentRecord
} from './types';

export async function fetchServiceOrderDetails(
    empresa: string,
    idClie: number,
    idOrds: number,
    date: string
): Promise<ServiceOrderDetails[]> {
    const params = [
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnIdClie', 'Int', idClie),
        createParam('lnIdOrds', 'Int', idOrds),
        createParam('ldCaData', 'SmallDatetime', date),
    ];
    return callProcedure<ServiceOrderDetails>('consultaDashboardProposta', params);
}

export async function fetchInternalAppointments(
    empresa: string,
    idClie: number,
    idOrds: number
): Promise<InternalAppointment[]> {
    const params = [
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnIdClie', 'Int', idClie),
        createParam('lnIdOrds', 'Int', idOrds),
    ];
    return callProcedure<InternalAppointment>('pesquisaApontamentosInternos', params);
}

export async function fetchAppointmentStatus(
    empresa: string,
    idClie: number,
    idOrds: number,
    date: string
): Promise<AppointmentStatus[]> {
    const params = [
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnIdCadt', 'Int', idClie), // Legacy uses lnIdCadt but maps to idClie usually? Or worksite ID.
        createParam('lnIdOrds', 'Int', idOrds),
        createParam('ldCaData', 'SmallDatetime', date),
    ];
    return callProcedure<AppointmentStatus>('pesquisaDashboardApontamentoSituacao', params);
}

export async function fetchStoppedAppointments(
    empresa: string,
    idClie: number,
    idOrds: number,
    date: string
): Promise<StoppedAppointment[]> {
    const params = [
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnIdCadt', 'Int', idClie),
        createParam('lnIdOrds', 'Int', idOrds),
        createParam('ldCaData', 'SmallDatetime', date),
    ];
    return callProcedure<StoppedAppointment>('pesquisaDashboardApontamentoParado', params);
}

export async function fetchPlannedRealizedComparison(
    empresa: string,
    idClie: number,
    idOrds: number,
    date: string
): Promise<PlannedRealizedComparison[]> {
    const params = [
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnIdCadt', 'Int', idClie),
        createParam('lnIdOrds', 'Int', idOrds),
        createParam('ldCaData', 'SmallDatetime', date),
    ];
    return callProcedure<PlannedRealizedComparison>('pesquisaDashboardHorasPlanejadasApontadas', params);
}

export async function fetchWorkShifts(
    empresa: string,
    idOrds: number
): Promise<WorkShift[]> {
    const params = [
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lcIdOrds', 'VarChar', idOrds.toString()),
    ];
    return callProcedure<WorkShift>('pesquisaJornadaOrdensServico', params);
}

export async function fetchAppointmentRecords(
    empresa: string,
    idClie: number,
    idOrds: number
): Promise<AppointmentRecord[]> {
    const params = [
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnIdClie', 'Int', idClie),
        createParam('lnIdOrds', 'Int', idOrds),
    ];
    return callProcedure<AppointmentRecord>('pesquisaRecursosApontadosProposta', params);
}
