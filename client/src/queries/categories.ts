import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
    getAllCategories,
    getActiveCategories,
    getParentCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    archiveCategory
} from '@/api/categories';


/**
 * React Query keys for category-related queries
 */
export const categoryQueryKeys = {
    all: ['categories'] as const,
    lists: () => [...categoryQueryKeys.all, 'list'] as const,
    list: (filter: string) => [...categoryQueryKeys.lists(), filter] as const,
    details: () => [...categoryQueryKeys.all, 'detail'] as const,
    detail: (id: number) => [...categoryQueryKeys.details(), id] as const,
    goals: {
        all: ['category-goals'] as const,
        lists: () => [...categoryQueryKeys.goals.all, 'list'] as const,
        list: (filter: string) => [...categoryQueryKeys.goals.lists(), filter] as const,
        details: () => [...categoryQueryKeys.goals.all, 'detail'] as const,
        detail: (id: number) => [...categoryQueryKeys.goals.details(), id] as const,
        byCategory: (categoryId: number) => [...categoryQueryKeys.goals.all, 'category', categoryId] as const,
        active: (categoryId: number) => [...categoryQueryKeys.goals.all, 'active', categoryId] as const,
    }
};

/**
 * Category Query Hooks
 */
export const useCategoriesQuery = () => {
    return useQuery({
        queryKey: categoryQueryKeys.list('all'),
        queryFn: getAllCategories,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useActiveCategoriesQuery = () => {
    return useQuery({
        queryKey: categoryQueryKeys.list('active'),
        queryFn: getActiveCategories,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useParentCategoriesQuery = () => {
    return useQuery({
        queryKey: categoryQueryKeys.list('parents'),
        queryFn: getParentCategories,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

/**
 * Category Mutation Hooks
 */
export const useCreateCategoryMutation = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: createCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: categoryQueryKeys.all });
        },
    });
};

export const useUpdateCategoryMutation = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: updateCategory,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: categoryQueryKeys.all });
            queryClient.invalidateQueries({ queryKey: categoryQueryKeys.detail(variables.id) });
        },
    });
};

export const useDeleteCategoryMutation = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: categoryQueryKeys.all });
        },
    });
};

export const useArchiveCategoryMutation = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: archiveCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: categoryQueryKeys.all });
        },
    });
};