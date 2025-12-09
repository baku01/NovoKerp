import { callProcedure, createParam } from '../../../api/procedures';

export interface NotificationFilter {
  read?: boolean | null;
  startDate?: string | null;
  endDate?: string | null;
}

export interface NotificationItem {
  id_note: number;
  no_text: string;
  no_user: string;
  no_dthr: string;
  no_read: number;
}

export async function fetchNotifications(userId: string, companyId: string, filter: NotificationFilter = {}) {
  const params = [
    createParam('lcIdUser', 'VarChar', userId),
    createParam('lcIdEmpr', 'VarChar', companyId),
    createParam('lnNoRead', 'Int', filter.read === undefined ? null : filter.read ? 0 : 1),
    createParam('ldNoDtde', 'SmallDatetime', filter.startDate ?? null),
    createParam('ldNoDtat', 'SmallDatetime', filter.endDate ?? null),
  ];

  return callProcedure<NotificationItem[]>('pesquisaNotificacoes', params);
}

export async function updateNotification(
  userId: string,
  companyId: string,
  notificationId: number,
  markAsRead: boolean
) {
  const params = [
    createParam('lcIdUser', 'VarChar', userId),
    createParam('lcIdEmpr', 'VarChar', companyId),
    createParam('lnIdNote', 'Int', notificationId),
    createParam('lnNoRead', 'Int', markAsRead ? 0 : 1),
    createParam('lnPqRead', 'Int', null),
    createParam('ldNoDtde', 'SmallDatetime', null),
    createParam('ldNoDtat', 'SmallDatetime', null),
  ];

  return callProcedure('atualizaNotificacao', params);
}
