import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { FormField } from "@/components/ui/common/form-field";
import { SelectField } from "@/components/ui/common/select-field";
import { useCategoryForm } from './useCategoryForm';
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { ICategory } from '@/types';
import { type CategoryFormData } from '@/types';

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

interface CategoryFormDialogProps {
    mode: 'create' | 'edit';
    category?: ICategory | null;
    parentCategories: ICategory[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (formData: CategoryFormData) => Promise<void>;
    isLoading: boolean;
    title: string;
    description: string;
    submitLabel: string;
    loadingLabel: string;
}

export function CategoryFormDialog({
    mode,
    category,
    parentCategories,
    open,
    onOpenChange,
    onSubmit,
    isLoading,
    title,
    description,
    submitLabel,
    loadingLabel
}: CategoryFormDialogProps) {
    const form = useCategoryForm();
    const formData = form.watch(); // For preview
    const [error, setError] = useState<string | null>(null);

    // Populate form with category data when editing
    useEffect(() => {
        if (mode === 'edit' && category && open) {
            form.reset({
                name: category.name,
                description: category.description || '',
                color: category.color,
                icon: category.icon || 'Star',
                parentId: category.parentId
            });
        }
    }, [mode, category, open, form]);

    const onFormSubmit = async (data: CategoryFormData) => {
        try {
            setError(null);
            await onSubmit(data);
            if (mode === 'create') {
                form.reset();
            }
            onOpenChange(false);
        } catch (error) {
            setError(error instanceof Error ? error.message : `Failed to ${mode} category`);
        }
    };

    const handleClose = () => {
        if (mode === 'create') {
            form.reset();
        }
        setError(null);
        onOpenChange(false);
    };

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            handleClose();
        } else {
            onOpenChange(newOpen);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4">
                    <FormField
                        name="name"
                        control={form.control}
                        label="Category Name"
                        placeholder="Enter category name"
                        required
                    />

                    <FormField
                        name="description"
                        control={form.control}
                        label="Description"
                        placeholder="Enter category description (optional)"
                        type="textarea"
                        description="Brief description of this category"
                    />

                    <SelectField
                        name="parentId"
                        control={form.control}
                        label="Parent Category"
                        placeholder="Select parent category"
                        options={[
                            { value: "", label: "None (Main Category)" },
                            ...parentCategories
                                .filter(cat => cat.id !== category?.id && !cat.parentId)
                                .map(cat => ({
                                    value: cat.id.toString(),
                                    label: cat.name
                                }))
                        ]}
                        description="Optional: Choose a parent category to create a subcategory"
                    />

                    <SelectField
                        name="color"
                        control={form.control}
                        label="Color"
                        placeholder="Select color"
                        options={COLOR_OPTIONS.map(color => ({
                            value: color.value,
                            label: color.label
                        }))}
                    />

                    <SelectField
                        name="icon"
                        control={form.control}
                        label="Icon"
                        placeholder="Select icon"
                        options={ICON_OPTIONS.map(option => ({
                            value: option.value,
                            label: option.label
                        }))}
                    />

                    {/* Preview */}
                    <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/50">
                        <div
                            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium"
                            style={{ backgroundColor: formData.color || '#3b82f6' }}
                        >
                            {formData.icon?.charAt(0) || 'S'}
                        </div>
                        <span className="text-sm text-muted-foreground">Preview</span>
                    </div>

                    <DialogFooter>
                        <Button
                            type="submit"
                            disabled={isLoading || !form.formState.isValid}
                        >
                            {isLoading ? loadingLabel : submitLabel}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}