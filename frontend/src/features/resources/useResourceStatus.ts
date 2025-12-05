import { useQuery } from '@tanstack/react-query';
import { useUserStore } from '../../stores/useUserStore';
import { fetchResourcesWithStatus } from './resourceService';
import { format } from 'date-fns';

export function useResourceStatus(idClie: number, date: Date) {
    const empresa = useUserStore((state) => state.empresa);
    const formattedDate = format(date, 'yyyy-MM-dd');
    const enabled = !!empresa && idClie > 0;

    const query = useQuery({
        queryKey: ['resources', 'status', empresa, idClie, formattedDate],
        queryFn: () => fetchResourcesWithStatus(empresa, idClie, formattedDate),
        enabled
    });

    return {
        resources: query.data || [],
        isLoading: query.isLoading
    };
}
