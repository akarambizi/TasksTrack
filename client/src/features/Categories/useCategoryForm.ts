import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { categoryFormSchema, type CategoryFormData } from '@/types';

export function useCategoryForm() {
    const form = useForm<CategoryFormData>({
        resolver: zodResolver(categoryFormSchema),
        defaultValues: {
            name: '',
            description: '',
            color: '#3b82f6',
            icon: 'Star',
            parentId: undefined
        },
        mode: 'onChange'
    });

    return {
        ...form,
        // Add any category-specific form helpers here if needed
    };
}