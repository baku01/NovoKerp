import { callProcedure, createParam } from '../../../api/procedures';

export interface UpdateUserProfilePayload {
  name: string;
  email: string;
}

export interface UpdatePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export async function updateUserProfile(userId: string, payload: UpdateUserProfilePayload) {
  const params = [
    createParam('lcIdUser', 'VarChar', userId),
    createParam('lcUsNome', 'VarChar', payload.name.toUpperCase()),
    createParam('lcUsMail', 'VarChar', payload.email.toUpperCase()),
    createParam('lcUsSmd5', 'VarChar', null),
  ];

  return callProcedure('atualizaUsuario', params);
}

export async function updateUserPassword(userId: string, newPasswordHash: string) {
  const params = [
    createParam('lcIdUser', 'VarChar', userId),
    createParam('lcUsNome', 'VarChar', null),
    createParam('lcUsMail', 'VarChar', null),
    createParam('lcUsSmd5', 'VarChar', newPasswordHash),
  ];

  return callProcedure('atualizaUsuario', params);
}
