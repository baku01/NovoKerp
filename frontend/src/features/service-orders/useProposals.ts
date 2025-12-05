import { useQuery } from '@tanstack/react-query';
import { useUserStore } from '../../stores/useUserStore';
import { callProcedure, createParam } from '../../api/procedures';
import { ServiceOrder } from '../stock-position/types'; // Reuse type or move to shared

// Duplicate of logic in stock-position/stockPositionService.ts but accessible for others
async function fetchProposals(empresa: string, worksiteId: number): Promise<ServiceOrder[]> {
    const params = [
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lnIdCadt', 'Int', worksiteId),
        createParam('lcOsNume', 'VarChar', null),
        createParam('lcOsResp', 'VarChar', null),
        createParam('lcOsDesc', 'VarChar', null),
        createParam('lcOsNcli', 'VarChar', null),
        createParam('lcOsNcon', 'VarChar', null),
    ];
    return callProcedure<ServiceOrder>('pesquisaPropostas', params);
}

export function useProposals(worksiteId: number) {
    const empresa = useUserStore((state) => state.empresa);
    const query = useQuery({
        queryKey: ['proposals', empresa, worksiteId],
        queryFn: () => fetchProposals(empresa, worksiteId),
        enabled: !!empresa && worksiteId > 0
    });
    return { proposals: query.data || [], isLoading: query.isLoading };
}
