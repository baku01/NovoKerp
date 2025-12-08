import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUserStore } from '../../stores/useUserStore';
import { 
    fetchProductionOrders, 
    fetchProductionOrderItems, 
    fetchProductionOrderSituations, 
    fetchProductionOrderProjects,
    insertProductionOrder,
    updateProductionOrder,
    deleteProductionOrder,
    insertProductionOrderItem,
    deleteProductionOrderItem,
    insertProductionOrderSituation,
    deleteProductionOrderSituation,
    uploadProductionOrderProject,
    deleteProductionOrderProject
} from './productionOrderService';
import { ProductionOrderFilter, ProductionOrderInput, ProductionOrderUpdateInput, ProductionOrderItemInput } from './types';

export function useProductionOrders(filters: ProductionOrderFilter) {
    const empresa = useUserStore((state) => state.empresa);
    const enabled = !!empresa && !!filters.worksiteId;

    const query = useQuery({
        queryKey: ['productionOrders', 'list', empresa, filters],
        queryFn: () => fetchProductionOrders(empresa, filters),
        enabled
    });

    return {
        orders: query.data || [],
        isLoading: query.isLoading
    };
}

export function useProductionOrderDetail(poNum: number | null) {
    const empresa = useUserStore((state) => state.empresa);
    const enabled = !!empresa && !!poNum;

    const itemsQuery = useQuery({
        queryKey: ['productionOrders', 'items', empresa, poNum],
        queryFn: () => fetchProductionOrderItems(empresa, poNum!),
        enabled
    });

    const situationsQuery = useQuery({
        queryKey: ['productionOrders', 'situations', empresa, poNum],
        queryFn: () => fetchProductionOrderSituations(empresa, poNum!),
        enabled
    });

    const projectsQuery = useQuery({
        queryKey: ['productionOrders', 'projects', poNum],
        queryFn: () => fetchProductionOrderProjects(poNum!),
        enabled
    });

    return {
        items: itemsQuery.data || [],
        situations: situationsQuery.data || [],
        projects: projectsQuery.data || [],
        isLoading: itemsQuery.isLoading || situationsQuery.isLoading || projectsQuery.isLoading,
        refetch: () => {
            itemsQuery.refetch();
            situationsQuery.refetch();
            projectsQuery.refetch();
        }
    };
}

export function useProductionOrderMutations() {
    const queryClient = useQueryClient();
    const empresa = useUserStore((state) => state.empresa);
    const user = useUserStore((state) => state.user);
    const userId = user?.id_user || '';

    const createOrder = useMutation({
        mutationFn: (data: ProductionOrderInput) => insertProductionOrder(empresa, userId, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['productionOrders'] })
    });

    const updateOrder = useMutation({
        mutationFn: (data: ProductionOrderUpdateInput) => updateProductionOrder(empresa, userId, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['productionOrders'] })
    });

    const deleteOrder = useMutation({
        mutationFn: (poNum: number) => deleteProductionOrder(empresa, userId, poNum),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['productionOrders'] })
    });

    const createItem = useMutation({
        mutationFn: ({ header, item }: { header: ProductionOrderUpdateInput, item: ProductionOrderItemInput }) => 
            insertProductionOrderItem(empresa, userId, header, item),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['productionOrders', 'items', empresa, variables.header.po_nume] });
            // Header might update too?
             queryClient.invalidateQueries({ queryKey: ['productionOrders', 'list'] });
        }
    });

    const deleteItem = useMutation({
        mutationFn: ({ poNum, itemId }: { poNum: number, itemId: number }) => deleteProductionOrderItem(empresa, userId, poNum, itemId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['productionOrders', 'items', empresa, variables.poNum] });
        }
    });

    const createSituation = useMutation({
        mutationFn: ({ poNum, situation }: { poNum: number, situation: string }) => insertProductionOrderSituation(empresa, userId, poNum, situation),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['productionOrders', 'situations', empresa, variables.poNum] });
            queryClient.invalidateQueries({ queryKey: ['productionOrders', 'list'] }); // Status updates in list
        }
    });

    const deleteSituation = useMutation({
        mutationFn: ({ poNum, date, situation }: { poNum: number, date: Date, situation: string }) => 
            deleteProductionOrderSituation(empresa, userId, poNum, date, situation),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['productionOrders', 'situations', empresa, variables.poNum] });
            queryClient.invalidateQueries({ queryKey: ['productionOrders', 'list'] });
        }
    });

    const uploadProject = useMutation({
        mutationFn: ({ poNum, file }: { poNum: number, file: File }) => uploadProductionOrderProject(poNum, file),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['productionOrders', 'projects', variables.poNum] });
        }
    });

    const deleteProject = useMutation({
        mutationFn: ({ poNum, fileName }: { poNum: number, fileName: string }) => deleteProductionOrderProject(poNum, fileName),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['productionOrders', 'projects', variables.poNum] });
        }
    });

    return {
        createOrder,
        updateOrder,
        deleteOrder,
        createItem,
        deleteItem,
        createSituation,
        deleteSituation,
        uploadProject,
        deleteProject
    };
}