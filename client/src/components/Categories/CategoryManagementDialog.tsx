import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Settings } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { CategoryFormDialog } from './CategoryFormDialog';
import { CategoryList } from './CategoryList';
import { type CategoryFormData, ICategoryUpdateRequest, ICategoryCreateRequest, ICategory } from '@/types';
import {
    useParentCategoriesQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
    useArchiveCategoryMutation
} from '@/queries/categories';



export const CategoryManagementDialog: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [formOpen, setFormOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());

    // Use hierarchical categories from backend instead of client-side grouping
    const { data: hierarchicalCategories = [], isLoading, refetch } = useParentCategoriesQuery();
    const createMutation = useCreateCategoryMutation();
    const updateMutation = useUpdateCategoryMutation();
    const deleteMutation = useDeleteCategoryMutation();
    const archiveMutation = useArchiveCategoryMutation();

    // Ensure hierarchical categories is always an array
    const categoriesArray = Array.isArray(hierarchicalCategories) ? hierarchicalCategories : [];
    // Get all categories (parents + subcategories) for parent dropdown in form
    const allCategories = categoriesArray.reduce<ICategory[]>((acc, parent) => {
        acc.push(parent);
        if (parent.subCategories) {
            acc.push(...parent.subCategories);
        }
        return acc;
    }, []);

    const handleFormSubmit = async (data: CategoryFormData) => {
        if (editingCategory) {
            // Update existing category
            const request: ICategoryUpdateRequest = {
                id: editingCategory.id,
                name: data.name.trim(),
                description: data.description?.trim() || undefined,
                color: data.color,
                icon: data.icon,
                parentId: data.parentId,
                isActive: editingCategory.isActive
            };
            await updateMutation.mutateAsync(request);
        } else {
            // Create new category
            const request: ICategoryCreateRequest = {
                name: data.name.trim(),
                description: data.description?.trim() || undefined,
                color: data.color,
                icon: data.icon,
                parentId: data.parentId
            };
            await createMutation.mutateAsync(request);
        }

        // Success - close form and refresh
        setFormOpen(false);
        setEditingCategory(null);
        refetch();
    };

    const handleDeleteCategory = async (id: number) => {
        if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
            return;
        }

        try {
            await deleteMutation.mutateAsync(id);
            refetch();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete category');
        }
    };

    const handleArchiveCategory = async (id: number) => {
        try {
            await archiveMutation.mutateAsync(id);
            refetch();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to archive category');
        }
    };

    const handleOpenForm = (category?: ICategory) => {
        setEditingCategory(category || null);
        setFormOpen(true);
    };

    const handleCloseForm = (open: boolean) => {
        setFormOpen(open);
        if (!open) {
            setEditingCategory(null);
        }
    };

    const toggleCategoryExpansion = (categoryId: number) => {
        setExpandedCategories(prev => {
            const newSet = new Set(prev);
            if (newSet.has(categoryId)) {
                newSet.delete(categoryId);
            } else {
                newSet.add(categoryId);
            }
            return newSet;
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen} modal={false}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <Settings className="h-4 w-4" />
                    Manage Categories
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Category Management</DialogTitle>
                    <DialogDescription>
                        Manage your habit categories. Categories help organize your habits and set specific goals.
                    </DialogDescription>
                </DialogHeader>

                <div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold">
                                    Categories ({categoriesArray.length})
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Parent categories and their subcategories. Click tags to edit subcategories.
                                </p>
                            </div>
                            <Button onClick={() => handleOpenForm()} className="gap-2">
                                <Plus className="h-4 w-4" />
                                Add Category
                            </Button>
                        </div>

                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <Card>
                            <CardContent className="p-4">
                                <div className="space-y-4">
                                    {/* Header */}
                                    <div className="grid grid-cols-4 gap-4 text-sm font-semibold border-b pb-2">
                                        <div>Category</div>
                                        <div>Description</div>
                                        <div>Status</div>
                                        <div className="text-right">Actions</div>
                                    </div>

                                    {/* Content */}
                                    {isLoading ? (
                                        <div className="text-center py-8">
                                            Loading categories...
                                        </div>
                                    ) : categoriesArray.length === 0 ? (
                                        <div className="text-center py-8">
                                            No categories found. Create your first category!
                                        </div>
                                    ) : (
                                        <CategoryList
                                            hierarchicalCategories={categoriesArray}
                                            expandedCategories={expandedCategories}
                                            onToggleExpansion={toggleCategoryExpansion}
                                            onEdit={handleOpenForm}
                                            onArchive={handleArchiveCategory}
                                            onDelete={handleDeleteCategory}
                                            archiveMutation={archiveMutation}
                                            deleteMutation={deleteMutation}
                                        />
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </DialogContent>

            <CategoryFormDialog
                mode={editingCategory ? 'edit' : 'create'}
                category={editingCategory}
                parentCategories={allCategories.filter(cat => !cat.parentId)}
                open={formOpen}
                onOpenChange={handleCloseForm}
                onSubmit={handleFormSubmit}
                isLoading={createMutation.isPending || updateMutation.isPending}
                title={editingCategory ? 'Edit Category' : 'Create New Category'}
                description={editingCategory ? 'Update the category details.' : 'Add a new category to organize your habits.'}
                submitLabel={editingCategory ? 'Update Category' : 'Create Category'}
                loadingLabel={editingCategory ? 'Updating...' : 'Creating...'}
            />
        </Dialog>
    );
};