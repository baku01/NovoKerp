import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUserStore } from '../../stores/useUserStore';
import {
    fetchDailyReports,
    fetchPhotos,
    uploadPhoto,
    deletePhoto
} from './dailyReportService';
import { RdoFilters, DailyReport } from './types';

export function useDailyReports(filters: RdoFilters) {
    const empresa = useUserStore((state) => state.empresa);
    const enabled = !!empresa;

    const query = useQuery({
        queryKey: ['dailyReports', 'list', empresa, filters],
        queryFn: () => fetchDailyReports(empresa, filters),
        enabled
    });

    return {
        reports: query.data || [],
        isLoading: query.isLoading
    };
}

export function useRdoPhotos(report: DailyReport | null) {
    const empresa = useUserStore((state) => state.empresa);
    const queryClient = useQueryClient();
    
    const enabled = !!empresa && !!report;
    const queryKey = ['dailyReports', 'photos', empresa, report?.id_clie, report?.ro_data, report?.ro_ords];

    const query = useQuery({
        queryKey,
        queryFn: () => report ? fetchPhotos(empresa, report) : Promise.resolve([]),
        enabled
    });

    const uploadMutation = useMutation({
        mutationFn: (base64: string) => {
            if (!report) throw new Error("No report selected");
            return uploadPhoto(empresa, report, base64);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (fileName: string) => {
            if (!report) throw new Error("No report selected");
            return deletePhoto(empresa, report, fileName);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        }
    });

    return {
        photos: query.data || [],
        isLoading: query.isLoading,
        uploadPhoto: uploadMutation.mutateAsync,
        deletePhoto: deleteMutation.mutateAsync,
        isUploading: uploadMutation.isPending,
        isDeleting: deleteMutation.isPending
    };
}
