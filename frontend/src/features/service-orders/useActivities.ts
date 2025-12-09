import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useUserStore } from '../../stores/useUserStore';
import {
  fetchActivityReport,
  fetchActivityResources,
  fetchActivityComments,
  updateRemainingDaysActivity,
  inactivateTask,
  type ActivityReport,
} from './activityService';

export function useActivities(worksiteId: number, orderId: number, date: Date) {
  const empresa = useUserStore((state) => state.empresa);
  const dateStr = useMemo(() => format(date, 'yyyy-MM-dd'), [date]);
  const enabled = !!empresa && worksiteId > 0 && orderId > 0;

  const reportQuery = useQuery({
    queryKey: ['activities', 'report', empresa, worksiteId, orderId, dateStr],
    queryFn: () => fetchActivityReport(empresa, worksiteId, orderId, date),
    enabled,
  });

  const resourcesQuery = useQuery({
    queryKey: ['activities', 'resources', empresa, worksiteId, orderId, dateStr],
    queryFn: () => fetchActivityResources(empresa, worksiteId, orderId, date),
    enabled,
  });

  const commentsQuery = useQuery({
    queryKey: ['activities', 'comments', empresa, worksiteId, orderId, dateStr],
    queryFn: () => fetchActivityComments(empresa, worksiteId, orderId, date),
    enabled,
  });

  return {
    reportQuery,
    resourcesQuery,
    commentsQuery,
  };
}

export function useUpdateRemainingDays(worksiteId: number, orderId: number, date: Date) {
  const empresa = useUserStore((state) => state.empresa);
  const queryClient = useQueryClient();
  const dateStr = useMemo(() => format(date, 'yyyy-MM-dd'), [date]);
  return useMutation({
    mutationFn: (payload: { exclusionId: number; activityId: number; remainingDays: number }) =>
      updateRemainingDaysActivity(empresa, orderId, payload.exclusionId, payload.activityId, payload.remainingDays),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['activities', 'report', empresa, worksiteId, orderId, dateStr],
      });
      queryClient.invalidateQueries({
        queryKey: ['activities', 'resources', empresa, worksiteId, orderId, dateStr],
      });
    },
  });
}

export function useInactivateActivity(orderId: number) {
  const empresa = useUserStore((state) => state.empresa);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { exclusionId: number }) => inactivateTask(empresa, orderId, payload.exclusionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });
}

export type ActivityRow = ActivityReport & {
  id_excl?: number;
  ap_real?: string;
};
