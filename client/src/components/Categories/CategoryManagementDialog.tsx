import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FormField, SelectField } from '@/components/ui';
import { Plus, Edit, Trash2, Archive, RotateCcw, Settings, ChevronDown, ChevronRight } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
    useCategoriesQuery,
    useParentCategoriesQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
    useArchiveCategoryMutation
} from '@/queries/categories';
import type { ICategory, ICategoryCreateRequest, ICategoryUpdateRequest } from '@/api/categories.types';

// Color options for categories
const COLOR_OPTIONS = [
    { value: '#22c55e', label: 'Green', preview: '#22c55e' },
    { value: '#3b82f6', label: 'Blue', preview: '#3b82f6' },
    { value: '#a855f7', label: 'Purple', preview: '#a855f7' },
    { value: '#f59e0b', label: 'Amber', preview: '#f59e0b' },
    { value: '#ef4444', label: 'Red', preview: '#ef4444' },
    { value: '#ec4899', label: 'Pink', preview: '#ec4899' },
    { value: '#6b7280', label: 'Gray', preview: '#6b7280' },
    { value: '#14b8a6', label: 'Teal', preview: '#14b8a6' }
];

// Icon options for categories
const ICON_OPTIONS = [
    { value: 'Heart', label: 'Heart' },
    { value: 'BookOpen', label: 'Book Open' },
    { value: 'Palette', label: 'Palette' },
    { value: 'Users', label: 'Users' },
    { value: 'Briefcase', label: 'Briefcase' },
    { value: 'User', label: 'User' },
    { value: 'Target', label: 'Target' },
    { value: 'Star', label: 'Star' },
    { value: 'Trophy', label: 'Trophy' },
    { value: 'Zap', label: 'Zap' }
];

interface CategoryFormData {
    name: string;
    description: string;
    color: string;
    icon: string;
    parentId?: number;
}

interface CategoryFormProps {
    category?: ICategory;
    parentCategories: ICategory[];
    onSubmit: (data: CategoryFormData) => void;
    isLoading: boolean;
    error: string | null;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ category, parentCategories, onSubmit, isLoading, error }) => {
    const [formData, setFormData] = useState<CategoryFormData>({
        name: category?.name || '',
        description: category?.description || '',
        color: category?.color || '#3b82f6',
        icon: category?.icon || 'Star',
        parentId: category?.parentId
    });

    const handleChange = (field: keyof CategoryFormData) => (value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: field === 'parentId' ? (value === 'none' || !value ? undefined : parseInt(value, 10)) : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <FormField
                id="name"
                name="name"
                label="Category Name"
                placeholder="Enter category name"
                value={formData.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('name')(e.target.value)}
                required
            />

            <FormField
                id="description"
                name="description"
                label="Description (Optional)"
                placeholder="Enter category description"
                value={formData.description}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('description')(e.target.value)}
            />

            <SelectField
                id="parentId"
                label="Parent Category (Optional)"
                placeholder="Select parent category"
                value={formData.parentId?.toString() || 'none'}
                onValueChange={(value) => handleChange('parentId')(value)}
                options={[
                    { value: 'none', label: 'None (Main Category)' },
                    ...parentCategories
                        .filter(cat => cat.id !== category?.id && !cat.parentId) // Exclude self and subcategories
                        .map(cat => ({
                            value: cat.id.toString(),
                            label: cat.name
                        }))
                ]}
            />

            <SelectField
                id="color"
                label="Color"
                placeholder="Select color"
                value={formData.color}
                onValueChange={handleChange('color')}
                options={COLOR_OPTIONS}
            />

            <SelectField
                id="icon"
                label="Icon"
                placeholder="Select icon"
                value={formData.icon}
                onValueChange={handleChange('icon')}
                options={ICON_OPTIONS}
            />

            <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/50">
                <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium"
                    style={{ backgroundColor: formData.color }}
                >
                    {formData.icon.charAt(0)}
                </div>
                <span className="text-sm text-muted-foreground">Preview</span>
            </div>

            <DialogFooter>
                <Button type="submit" disabled={isLoading || !formData.name.trim()}>
                    {isLoading ? 'Saving...' : category ? 'Update Category' : 'Create Category'}
                </Button>
            </DialogFooter>
        </form>
    );
};

export const CategoryManagementDialog: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());

    const { data: categories = [], isLoading, refetch } = useCategoriesQuery();
    const { data: parentCategories = [] } = useParentCategoriesQuery();
    const createMutation = useCreateCategoryMutation();
    const updateMutation = useUpdateCategoryMutation();
    const deleteMutation = useDeleteCategoryMutation();
    const archiveMutation = useArchiveCategoryMutation();

    // Ensure categories is always an array
    const categoriesArray = Array.isArray(categories) ? categories : [];

    const handleCreateCategory = async (data: CategoryFormData) => {
        try {
            setError(null);
            const request: ICategoryCreateRequest = {
                name: data.name.trim(),
                description: data.description.trim() || undefined,
                color: data.color,
                icon: data.icon,
                parentId: data.parentId
            };

            await createMutation.mutateAsync(request);
            setShowForm(false);
            refetch();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create category');
        }
    };

    const handleUpdateCategory = async (data: CategoryFormData) => {
        if (!editingCategory) return;

        try {
            setError(null);
            const request: ICategoryUpdateRequest = {
                id: editingCategory.id,
                name: data.name.trim(),
                description: data.description.trim() || undefined,
                color: data.color,
                icon: data.icon,
                parentId: data.parentId,
                isActive: editingCategory.isActive
            };

            await updateMutation.mutateAsync(request);
            setEditingCategory(null);
            setShowForm(false);
            refetch();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update category');
        }
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
        setShowForm(true);
        setError(null);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingCategory(null);
        setError(null);
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

                {showForm ? (
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">
                                {editingCategory ? 'Edit Category' : 'Create New Category'}
                            </h3>
                            <Button variant="ghost" onClick={handleCloseForm}>
                                Cancel
                            </Button>
                        </div>
                        <CategoryForm
                            category={editingCategory || undefined}
                            parentCategories={parentCategories}
                            onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory}
                            isLoading={createMutation.isPending || updateMutation.isPending}
                            error={error}
                        />
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold">
                                    Categories ({categoriesArray.filter(cat => !cat.parentId).length})
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
                                    ) : ((() => {
                                        // Group categories by parent
                                        const parentCategories = categoriesArray.filter(cat => !cat.parentId);
                                        const subcategoriesMap = new Map<number, ICategory[]>();

                                        categoriesArray.filter(cat => cat.parentId).forEach(subcat => {
                                            const parentId = subcat.parentId!;
                                            if (!subcategoriesMap.has(parentId)) {
                                                subcategoriesMap.set(parentId, []);
                                            }
                                            subcategoriesMap.get(parentId)!.push(subcat);
                                        });

                                        const allItems: JSX.Element[] = [];

                                        parentCategories
                                            .sort((a, b) => a.name.localeCompare(b.name))
                                            .forEach((category) => {
                                                const subcategories = subcategoriesMap.get(category.id) || [];
                                                const isExpanded = expandedCategories.has(category.id);
                                                const hasSubcategories = subcategories.length > 0;

                                                // Parent category row
                                                allItems.push(
                                                    <div key={category.id} className="py-3 border-b last:border-b-0">
                                                        <div className="grid grid-cols-4 gap-4">
                                                            <div>
                                                                <div className="flex items-center gap-2">
                                                                    {hasSubcategories && (
                                                                        <button
                                                                            onClick={() => toggleCategoryExpansion(category.id)}
                                                                            className="p-1 hover:bg-muted rounded"
                                                                        >
                                                                            {isExpanded ? (
                                                                                <ChevronDown className="h-4 w-4" />
                                                                            ) : (
                                                                                <ChevronRight className="h-4 w-4" />
                                                                            )}
                                                                        </button>
                                                                    )}
                                                                    {!hasSubcategories && <div className="w-6" />}
                                                                    <div
                                                                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium"
                                                                        style={{ backgroundColor: category.color }}
                                                                    >
                                                                        {category.icon?.charAt(0) || category.name.charAt(0)}
                                                                    </div>
                                                                    <span className="font-medium">{category.name}</span>
                                                                </div>
                                                                {/* Subcategory tags */}
                                                                {hasSubcategories && (
                                                                    <div className="mt-2 ml-8 flex flex-wrap gap-1">
                                                                        {subcategories.map((subcat) => (
                                                                            <Badge
                                                                                key={subcat.id}
                                                                                variant="secondary"
                                                                                className="text-xs cursor-pointer hover:bg-muted-foreground/20"
                                                                                onClick={() => handleOpenForm(subcat)}
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
                                                            <div className="text-muted-foreground">
                                                                {category.description || 'No description'}
                                                            </div>
                                                            <div>
                                                                <Badge variant={category.isActive ? 'default' : 'secondary'}>
                                                                    {category.isActive ? 'Active' : 'Archived'}
                                                                </Badge>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="flex items-center justify-end gap-1">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => handleOpenForm(category)}
                                                                    >
                                                                        <Edit className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => handleArchiveCategory(category.id)}
                                                                        disabled={archiveMutation.isPending}
                                                                    >
                                                                        {category.isActive ? (
                                                                            <Archive className="h-4 w-4" />
                                                                        ) : (
                                                                            <RotateCcw className="h-4 w-4" />
                                                                        )}
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => handleDeleteCategory(category.id)}
                                                                        disabled={deleteMutation.isPending}
                                                                        className="text-destructive hover:text-destructive"
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Expanded subcategory details */}
                                                        {isExpanded && hasSubcategories && (
                                                            <div className="mt-4 ml-8 space-y-2">
                                                                {subcategories
                                                                    .sort((a, b) => a.name.localeCompare(b.name))
                                                                    .map((subcat) => (
                                                                    <div key={subcat.id} className="grid grid-cols-4 gap-4 py-2 pl-4 border-l-2 border-muted bg-muted/30 rounded">
                                                                        <div>
                                                                            <div className="flex items-center gap-2">
                                                                                <div
                                                                                    className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-medium"
                                                                                    style={{ backgroundColor: subcat.color }}
                                                                                >
                                                                                    {subcat.icon?.charAt(0) || subcat.name.charAt(0)}
                                                                                </div>
                                                                                <span className="font-medium text-sm">{subcat.name}</span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="text-muted-foreground text-sm">
                                                                            {subcat.description || 'No description'}
                                                                        </div>
                                                                        <div>
                                                                            <Badge variant={subcat.isActive ? 'default' : 'secondary'} className="text-xs">
                                                                                {subcat.isActive ? 'Active' : 'Archived'}
                                                                            </Badge>
                                                                        </div>
                                                                        <div className="text-right">
                                                                            <div className="flex items-center justify-end gap-1">
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="sm"
                                                                                    onClick={() => handleOpenForm(subcat)}
                                                                                >
                                                                                    <Edit className="h-3 w-3" />
                                                                                </Button>
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="sm"
                                                                                    onClick={() => handleArchiveCategory(subcat.id)}
                                                                                    disabled={archiveMutation.isPending}
                                                                                >
                                                                                    {subcat.isActive ? (
                                                                                        <Archive className="h-3 w-3" />
                                                                                    ) : (
                                                                                        <RotateCcw className="h-3 w-3" />
                                                                                    )}
                                                                                </Button>
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="sm"
                                                                                    onClick={() => handleDeleteCategory(subcat.id)}
                                                                                    disabled={deleteMutation.isPending}
                                                                                    className="text-destructive hover:text-destructive"
                                                                                >
                                                                                    <Trash2 className="h-3 w-3" />
                                                                                </Button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            });

                                        return allItems;
                                    })()
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};