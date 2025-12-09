import { callLegacyProcedure, type SqlParam } from '../../legacy/legacyProcedures';

export interface SearchConfig {
  procedure: string;
  params: SqlParam[];
}

export async function searchEntities<T>(config: SearchConfig) {
  return callLegacyProcedure<T[]>(config.procedure, config.params);
}
