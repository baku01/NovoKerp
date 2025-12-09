import { callProcedure, createParam } from '../../../api/procedures';

export interface MenuItem {
  id_posi: string;
  mn_pare: string | null;
  mn_deno: string;
  mn_tipo: string;
  mn_tela?: string | null;
  mn_path?: string | null;
}

export interface AuthorityItem {
  id_posi: string;
}

export async function fetchMenu(companyId: string, menuType: string | null = null) {
  const params = [
    createParam('lcIdEmpr', 'VarChar', companyId),
    createParam('lcIdUser', 'VarChar', null),
    createParam('lcMnTipo', 'VarChar', menuType),
    createParam('lcIdPosi', 'VarChar', null),
  ];

  return callProcedure<MenuItem[]>('pesquisaMenu', params);
}

export async function fetchAuthorities(companyId: string, userId: string) {
  const params = [
    createParam('lcIdEmpr', 'VarChar', companyId),
    createParam('lcIdUser', 'VarChar', userId),
  ];

  return callProcedure<AuthorityItem[]>('pesquisaAutoridades', params);
}

export async function updateAuthorities(companyId: string, userId: string, positions: string[]) {
  const paramValue = positions.join(',').replace(/\+/g, 'M');
  const params = [
    createParam('lcIdEmpr', 'VarChar', companyId),
    createParam('lcIdUser', 'VarChar', userId),
    createParam('lcAtChck', 'VarChar', paramValue),
  ];

  return callProcedure('insereAutoridade', params);
}
