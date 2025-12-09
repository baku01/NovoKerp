import { callProcedure, createParam } from '../../api/procedures';
import { format } from 'date-fns';
import { AppointmentResource, Justification, AppointmentStatusOption } from './types';

export interface SecullumAppointment {
  ap_data: string;
  id_matr: number;
  fu_nome: string;
  fu_func: string;
  ap_hent: number;
  ap_hiin: number;
  ap_htin: number;
  ap_hter: number;
  ap_feri: number;
  ap_situ: string;
  ap_obsr?: string;
}

export interface SecullumHistory {
  es_data: string;
  es_hent: number;
  es_hiin: number;
  es_htin: number;
  es_hter: number;
  es_just: string;
  id_user: string;
}

export async function fetchSecullumAppointments(
  empresa: string,
  worksiteId: number,
  date: Date
): Promise<SecullumAppointment[]> {
  const params = [
    createParam('lcIdEmpr', 'VarChar', empresa),
    createParam('lnIdClie', 'Int', worksiteId),
    createParam('ldApData', 'SmallDatetime', format(date, 'yyyy-MM-dd')),
  ];
  return callProcedure<SecullumAppointment>('pesquisaApontamentosSecullum', params);
}

export async function fetchSecullumAppointmentsByEmployee(
  empresa: string,
  employeeId: number,
  date: Date
): Promise<SecullumAppointment[]> {
  const params = [
    createParam('lcIdEmpr', 'VarChar', empresa),
    createParam('lnIdMatr', 'Int', employeeId),
    createParam('ldApData', 'SmallDatetime', format(date, 'yyyy-MM-dd')),
  ];
  return callProcedure<SecullumAppointment>('pesquisaApontamentosSecullumFuncionario', params);
}

export async function fetchSecullumHistory(
  empresa: string,
  employeeId: number,
  date: Date
): Promise<SecullumHistory[]> {
  const params = [
    createParam('lcIdEmpr', 'VarChar', empresa),
    createParam('lnIdMatr', 'Int', employeeId),
    createParam('ldApData', 'SmallDatetime', format(date, 'yyyy-MM-dd')),
  ];
  return callProcedure<SecullumHistory>('pesquisaHistoricoEdicaoApontamentosSecullum', params);
}

export async function insertManualSecullum(
  userId: string,
  empresa: string,
  employeeId: number,
  date: Date,
  payload: { hent?: number; hiin?: number; htin?: number; hter?: number; justification: string }
) {
  const params = [
    createParam('lcIdUser', 'VarChar', userId),
    createParam('lcIdEmpr', 'VarChar', empresa),
    createParam('lnIdMatr', 'Int', employeeId),
    createParam('ldEsData', 'SmallDatetime', format(date, 'yyyy-MM-dd')),
    createParam('lnEsHent', 'Decimal', payload.hent || 0),
    createParam('lnEsHiin', 'Decimal', payload.hiin || 0),
    createParam('lnEsHtin', 'Decimal', payload.htin || 0),
    createParam('lnEsHter', 'Decimal', payload.hter || 0),
    createParam('lcEsJust', 'VarChar', payload.justification),
  ];
  return callProcedure('insereApontamentoSecullumManual', params);
}

export async function updateSecullum(
  userId: string,
  empresa: string,
  appointmentId: number,
  payload: { hent?: number; hiin?: number; htin?: number; hter?: number; justification?: string }
) {
  const params = [
    createParam('lcIdUser', 'VarChar', userId),
    createParam('lcIdEmpr', 'VarChar', empresa),
    createParam('lnIdApnt', 'Int', appointmentId),
    createParam('lnEsHent', 'Decimal', payload.hent || 0),
    createParam('lnEsHiin', 'Decimal', payload.hiin || 0),
    createParam('lnEsHtin', 'Decimal', payload.htin || 0),
    createParam('lnEsHter', 'Decimal', payload.hter || 0),
    createParam('lcEsJust', 'VarChar', payload.justification || ''),
  ];
  return callProcedure('atualizaApontamentoSecullum', params);
}

export async function deleteSecullum(empresa: string, appointmentId: number) {
  const params = [
    createParam('lcIdEmpr', 'VarChar', empresa),
    createParam('lnIdApnt', 'Int', appointmentId),
  ];
  return callProcedure('deletaApontamentoSecullum', params);
}

export async function fetchJourney(empresa: string, worksiteId: number, date: Date) {
  const params = [
    createParam('lcIdEmpr', 'VarChar', empresa),
    createParam('lnIdClie', 'Int', worksiteId),
    createParam('ldDrData', 'SmallDatetime', format(date, 'yyyy-MM-dd')),
  ];
  return callProcedure('pesquisaJornada', params);
}

export async function fetchJourneyResources(empresa: string, worksiteId: number, date: Date) {
  const params = [
    createParam('lcIdEmpr', 'VarChar', empresa),
    createParam('lnIdClie', 'Int', worksiteId),
    createParam('ldDrData', 'SmallDatetime', format(date, 'yyyy-MM-dd')),
  ];
  return callProcedure('pesquisaJornadaRecursos', params);
}

export async function fetchAppointmentsByEmployee(
  empresa: string,
  employeeId: number,
  startDate: Date,
  endDate: Date
): Promise<AppointmentResource[]> {
  const params = [
    createParam('lcIdEmpr', 'VarChar', empresa),
    createParam('lnIdMatr', 'Int', employeeId),
    createParam('ldDrDtde', 'SmallDatetime', format(startDate, 'yyyy-MM-dd')),
    createParam('ldDrDtat', 'SmallDatetime', format(endDate, 'yyyy-MM-dd')),
  ];
  return callProcedure<AppointmentResource>('pesquisaApontamentosFuncionarios', params);
}

export async function fetchHoliday(empresa: string, date: Date) {
  const params = [
    createParam('lcIdEmpr', 'VarChar', empresa),
    createParam('ldDrData', 'SmallDatetime', format(date, 'yyyy-MM-dd')),
  ];
  return callProcedure<{ isHoliday: number }>('consultaFeriado', params);
}

export async function fetchAbsenceJustifications(empresa: string): Promise<Justification[]> {
  const params = [createParam('lcIdEmpr', 'VarChar', empresa)];
  return callProcedure<Justification>('pesquisaJustificativasFalta', params);
}

export async function fetchResourceStatuses(empresa: string): Promise<AppointmentStatusOption[]> {
  const params = [createParam('lcIdEmpr', 'VarChar', empresa)];
  return callProcedure<AppointmentStatusOption>('pesquisaStatusRecurso', params);
}
