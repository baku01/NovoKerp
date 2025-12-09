import { useQuery } from '@tanstack/react-query';
import { useUserStore } from '../../stores/useUserStore';
import { callProcedure, createParam } from '../../api/procedures';

interface AuthorityResult {
    allowed: boolean;
}

/**
 * Tiny helper to reuse the legacy `consultaAutoridadeObjeto` gate.
 * Pass the same file/object identifiers used in the legacy app.
 */
async function fetchAuthority(idFile: string, idObject: string, userId: string, empresa: string): Promise<AuthorityResult> {
    const params = [
        createParam('lcIdUser', 'VarChar', userId.trim().toUpperCase()),
        createParam('lcIdEmpr', 'VarChar', empresa),
        createParam('lcIdFile', 'VarChar', idFile),
        createParam('lcIdObjt', 'VarChar', idObject),
    ];

    const rows = await callProcedure<Record<string, unknown>>('consultaAutoridadeObjeto', params);
    return { allowed: (rows?.length || 0) > 0 };
}

export function useAuthority(idFile: string, idObject: string) {
    const user = useUserStore((state) => state.user);
    const empresa = useUserStore((state) => state.empresa);

    return useQuery({
        queryKey: ['authority', idFile, idObject, user?.id_user, empresa],
        queryFn: () => fetchAuthority(idFile, idObject, user!.id_user, empresa),
        enabled: !!user && !!empresa,
        staleTime: 1000 * 60 * 10,
    });
}
