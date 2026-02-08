import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { CategoryRow } from '@/components/ui/common';
import type { ICategory } from '@/types';

interface CategoryListProps {
    hierarchicalCategories: ICategory[];
    expandedCategories: Set<number>;
    onToggleExpansion: (categoryId: number) => void;
    onEdit: (category: ICategory) => void;
    onArchive: (id: number) => void;
    onDelete: (id: number) => void;
    archiveMutation: { isPending: boolean };
    deleteMutation: { isPending: boolean };
}

export const CategoryList: React.FC<CategoryListProps> = ({
    hierarchicalCategories,
    expandedCategories,
    onToggleExpansion,
    onEdit,
    onArchive,
    onDelete,
    archiveMutation,
    deleteMutation
}) => {
    // Use hierarchical data from backend instead of client-side grouping
    const allItems = hierarchicalCategories
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((category) => {
            const subcategories = category.subCategories || [];
            const isExpanded = expandedCategories.has(category.id);
            const hasSubcategories = subcategories.length > 0;

            // Parent category row
            return (
                <div key={category.id} className="py-3 border-b last:border-b-0">
                    <div className="relative">
                        {/* Expansion button */}
                        {hasSubcategories && (
                            <button
                                onClick={() => onToggleExpansion(category.id)}
                                className="absolute -left-6 top-0 p-1 hover:bg-muted rounded"
                            >
                                {isExpanded ? (
                                    <ChevronDown className="h-4 w-4" />
                                ) : (
                                    <ChevronRight className="h-4 w-4" />
                                )}
                            </button>
                        )}

                        <CategoryRow
                            category={category}
                            onEdit={onEdit}
                            onArchive={onArchive}
                            onDelete={onDelete}
                            archiveMutation={archiveMutation}
                            deleteMutation={deleteMutation}
                        />

                        {/* Subcategory tags */}
                        {hasSubcategories && (
                            <div className="mt-2 ml-8 flex flex-wrap gap-1">
                                {subcategories.map((subcat) => (
                                    <Badge
                                        key={subcat.id}
                                        variant="secondary"
                                        className="text-xs cursor-pointer hover:bg-muted-foreground/20"
                                        onClick={() => onEdit(subcat)}
                                    >
                                        <div
                                            className="w-3 h-3 rounded-full mr-1"
                                            style={{ backgroundColor: subcat.color }}
                                        />
                                        {subcat.name}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Expanded subcategory details */}
                    {isExpanded && hasSubcategories && (
                        <div className="mt-4 ml-8 space-y-2">
                            {subcategories
                                .sort((a, b) => a.name.localeCompare(b.name))
                                .map((subcat) => (
                                    <CategoryRow
                                        key={subcat.id}
                                        category={subcat}
                                        onEdit={onEdit}
                                        onArchive={onArchive}
                                        onDelete={onDelete}
                                        archiveMutation={archiveMutation}
                                        deleteMutation={deleteMutation}
                                        size="sm"
                                        className="py-2 pl-4 border-l-2 border-muted bg-muted/30 rounded"
                                    />
                                ))}
                        </div>
                    )}
                </div>
            );
        });

    return <>{allItems}</>;
};