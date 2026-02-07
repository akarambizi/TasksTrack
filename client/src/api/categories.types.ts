// Type definitions for category-related operations

/**
 * Category API Types - matches server-side Category model
 */
export interface ICategory {
    id: number;
    name: string;
    description?: string;
    color?: string; // Hex color code
    icon?: string; // Icon name for UI
    parentId?: number; // For subcategories
    isActive: boolean;
    createdDate: string;
    updatedDate?: string;
    createdBy: string;
    updatedBy?: string;
    
    // Navigation properties (populated when needed)
    parent?: ICategory;
    subCategories?: ICategory[];
}

export interface ICategoryCreateRequest {
    name: string;
    description?: string;
    color?: string;
    icon?: string;
    parentId?: number; // For creating subcategories
}

export interface ICategoryUpdateRequest {
    id: number;
    name: string;
    description?: string;
    color?: string;
    icon?: string;
    parentId?: number; // For moving between categories
    isActive: boolean;
}