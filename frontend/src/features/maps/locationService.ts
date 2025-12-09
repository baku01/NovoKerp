import { callProcedure, createParam } from '../../api/procedures';

export interface LocationRecord {
  mp_data: string;
  mp_ende: string;
  mp_nume: string;
  mp_cida: string;
  mp_esta: string;
  mp_ncep: string;
  mp_lati: string;
  mp_long: string;
  us_nome: string;
}

export async function fetchUserLocations(companyId: string, userId: string, startDate?: string, endDate?: string): Promise<LocationRecord[]> {
  const params = [
    createParam('lcIdEmpr', 'VarChar', companyId),
    createParam('lcIdUser', 'VarChar', userId),
    createParam('ldMpDtde', 'SmallDatetime', startDate ?? null),
    createParam('ldMpDtat', 'SmallDatetime', endDate ?? null),
  ];

  return callProcedure<LocationRecord>('pesquisaLocaisUsuario', params);
}
