import { z } from 'zod';

// Define ICategory type first to avoid circular reference issues
export type ICategory = {
  id: number;
  name: string;
  description?: string | null;
  color?: string;
  icon?: string;
  parentId?: number;
  isActive: boolean;
  createdDate: string;
  updatedDate?: string;
  createdBy: string;
  updatedBy?: string;
  parent?: ICategory | null;
  children?: ICategory[];
  subCategories?: ICategory[]; // Add this for backward compatibility
};

// Category entity schema (complete database model)
export const categoryEntitySchema: z.ZodType<ICategory> = z.object({
  id: z.number(),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional().or(z.literal('')),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  icon: z.string().optional(),
  parentId: z.number().positive().optional(),
  isActive: z.boolean(),
  createdDate: z.string(),
  updatedDate: z.string().optional(),
  createdBy: z.string(),
  updatedBy: z.string().optional(),
  // Navigation properties (populated when needed)
  parent: z.lazy(() => categoryEntitySchema).optional(),
  children: z.array(z.lazy(() => categoryEntitySchema)).optional(),
});

// Category form schema (for creating/editing categories)
export const categoryFormSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional().or(z.literal('')),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  icon: z.string().optional(),
  parentId: z.number().positive().optional(),
});

// Category request schemas for API operations
export const categoryCreateRequestSchema = categoryFormSchema;
export const categoryUpdateRequestSchema = categoryFormSchema.extend({
  id: z.number(),
  isActive: z.boolean().optional(),
});

// Export types
export type CategoryFormData = z.infer<typeof categoryFormSchema>;
export type ICategoryCreateRequest = z.infer<typeof categoryCreateRequestSchema>;
export type ICategoryUpdateRequest = z.infer<typeof categoryUpdateRequestSchema>;
