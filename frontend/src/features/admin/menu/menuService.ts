import { callProcedure, createParam } from '../../../api/procedures';
import type { MenuItem } from '../authority/authorityService';

export async function createMenu(companyId: string, menu: Omit<MenuItem, 'id_posi'> & { id_posi: string }) {
  const params = [
    createParam('lcIdEmpr', 'VarChar', companyId),
    createParam('lcIdPosi', 'VarChar', menu.id_posi.replace('+', 'M').toUpperCase()),
    createParam('lcMnPare', 'VarChar', menu.mn_pare?.replace('+', 'M').toUpperCase() ?? ''),
    createParam('lcMnDeno', 'VarChar', menu.mn_deno.toUpperCase()),
    createParam('lcMnImag', 'VarChar', ''),
    createParam('lcMnTela', 'VarChar', menu.mn_tela ?? ''),
    createParam('lcMnPath', 'VarChar', menu.mn_path ?? ''),
    createParam('lcMnLink', 'VarChar', ''),
    createParam('lcMnTipo', 'VarChar', menu.mn_tipo.toUpperCase()),
  ];

  return callProcedure('insereMenu', params);
}

export async function deleteMenu(companyId: string, positionId: string) {
  const params = [
    createParam('lcIdEmpr', 'VarChar', companyId),
    createParam('lcIdPosi', 'VarChar', positionId.replace('+', 'M')),
  ];

  return callProcedure('deletaMenu', params);
}

export { fetchMenu } from '../authority/authorityService';
