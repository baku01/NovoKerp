import { useQuery } from '@tanstack/react-query';
import { useUserStore } from '../../stores/useUserStore';
import { fetchDocumentWorksites, fetchDocuments } from './documentService';

export function useDocumentWorksites() {
    const user = useUserStore((state) => state.user);
    const empresa = useUserStore((state) => state.empresa);

    const query = useQuery({
        queryKey: ['documents', 'worksites', empresa],
        queryFn: () => fetchDocumentWorksites(empresa, user?.id_user || ''),
        enabled: !!user && !!empresa
    });

    return { worksites: query.data || [], isLoading: query.isLoading };
}

export function useDocuments(path: string, isFileSearch: boolean = false) {
    const user = useUserStore((state) => state.user);
    const empresa = useUserStore((state) => state.empresa);

    const query = useQuery({
        queryKey: ['documents', 'list', empresa, path, isFileSearch],
        queryFn: () => fetchDocuments(empresa, user?.id_user || '', path, isFileSearch),
        enabled: !!user && !!empresa && path.length > 0
    });

    return { items: query.data || [], isLoading: query.isLoading };
}
