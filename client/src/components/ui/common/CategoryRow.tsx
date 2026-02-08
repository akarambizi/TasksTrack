import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CategoryDisplay } from './CategoryDisplay';
import { CategoryActions } from './CategoryActions';
import type { ICategory } from '@/types';

interface CategoryRowProps {
    category: ICategory;
    onEdit: (category: ICategory) => void;
    onArchive: (id: number) => void;
    onDelete: (id: number) => void;
    archiveMutation: { isPending: boolean };
    deleteMutation: { isPending: boolean };
    size?: 'sm' | 'md';
    className?: string;
    children?: React.ReactNode;
}

export const CategoryRow: React.FC<CategoryRowProps> = ({
    category,
    onEdit,
    onArchive,
    onDelete,
    archiveMutation,
    deleteMutation,
    size = 'md',
    className = '',
    children
}) => {
    return (
        <div className={`grid grid-cols-4 gap-4 ${className}`}>
            <div>
                <CategoryDisplay category={category} size={size} />
                {children}
            </div>
            <div className={`text-muted-foreground ${size === 'sm' ? 'text-sm' : ''}`}>
                {category.description || 'No description'}
            </div>
            <div>
                <Badge
                    variant={category.isActive ? 'default' : 'secondary'}
                    className={size === 'sm' ? 'text-xs' : ''}
                >
                    {category.isActive ? 'Active' : 'Archived'}
                </Badge>
            </div>
            <div className="text-right">
                <CategoryActions
                    category={category}
                    onEdit={() => onEdit(category)}
                    onArchive={() => onArchive(category.id)}
                    onDelete={() => onDelete(category.id)}
                    archiveMutation={archiveMutation}
                    deleteMutation={deleteMutation}
                    size={size}
                />
            </div>
        </div>
    );
};