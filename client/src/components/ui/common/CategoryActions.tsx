import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Archive, RotateCcw } from 'lucide-react';

interface CategoryActionsProps {
    category: {
        id: number;
        isActive: boolean;
    };
    onEdit: () => void;
    onArchive: () => void;
    onDelete: () => void;
    archiveMutation: { isPending: boolean };
    deleteMutation: { isPending: boolean };
    size?: 'sm' | 'md';
}

export const CategoryActions: React.FC<CategoryActionsProps> = ({
    category,
    onEdit,
    onArchive,
    onDelete,
    archiveMutation,
    deleteMutation,
    size = 'md'
}) => {
    const iconSize = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';

    return (
        <div className="flex items-center justify-end gap-1">
            <Button
                variant="ghost"
                size="sm"
                onClick={onEdit}
            >
                <Edit className={iconSize} />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={onArchive}
                disabled={archiveMutation.isPending}
            >
                {category.isActive ? (
                    <Archive className={iconSize} />
                ) : (
                    <RotateCcw className={iconSize} />
                )}
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={onDelete}
                disabled={deleteMutation.isPending}
                className="text-destructive hover:text-destructive"
            >
                <Trash2 className={iconSize} />
            </Button>
        </div>
    );
};