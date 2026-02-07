import { apiGet, apiPost, apiPut, apiDelete, apiPatch } from './apiClient';
import { ToastService } from '../services/toastService';
import type {
    ICategory,
    ICategoryCreateRequest,
    ICategoryUpdateRequest
} from '@/types';

/**
 * Gets all categories.
 * @returns {Promise<ICategory[]>} Array of categories.
 */
export const getAllCategories = async (): Promise<ICategory[]> => {
    try {
        return await apiGet<ICategory[]>('/api/categories');
    } catch (error) {
        console.error('Failed to fetch categories:', error);
        ToastService.error('Failed to fetch categories');
        return [];
    }
};

/**
 * Gets active categories only.
 * @returns {Promise<ICategory[]>} Array of active categories.
 */
export const getActiveCategories = async (): Promise<ICategory[]> => {
    try {
        return await apiGet<ICategory[]>('/api/categories/active');
    } catch (error) {
        console.error('Failed to fetch active categories:', error);
        ToastService.error('Failed to fetch active categories');
        return [];
    }
};

/**
 * Gets parent categories (categories without a parent).
 * @returns {Promise<ICategory[]>} Array of parent categories with their subcategories.
 */
export const getParentCategories = async (): Promise<ICategory[]> => {
    try {
        return await apiGet<ICategory[]>('/api/categories/parents');
    } catch (error) {
        console.error('Failed to fetch parent categories:', error);
        ToastService.error('Failed to fetch parent categories');
        return [];
    }
};

/**
 * Creates a new category.
 * @param {ICategoryCreateRequest} category - The category data to create.
 * @returns {Promise<ICategory>} The created category.
 */
export const createCategory = async (category: ICategoryCreateRequest): Promise<ICategory> => {
    try {
        const result = await apiPost<ICategory>('/api/categories', category);
        ToastService.success('Category created successfully');
        return result;
    } catch (error) {
        console.error('Failed to create category:', error);
        ToastService.error('Failed to create category');
        throw error;
    }
};

/**
 * Updates an existing category.
 * @param {ICategoryUpdateRequest} category - The category data to update.
 * @returns {Promise<void>}
 */
export const updateCategory = async (category: ICategoryUpdateRequest): Promise<void> => {
    try {
        await apiPut(`/api/categories/${category.id}`, category);
        ToastService.success('Category updated successfully');
    } catch (error) {
        console.error(`Failed to update category ${category.id}:`, error);
        ToastService.error('Failed to update category');
        throw error;
    }
};

/**
 * Deletes a category.
 * @param {number} id - The ID of the category to delete.
 * @returns {Promise<void>}
 */
export const deleteCategory = async (id: number): Promise<void> => {
    try {
        await apiDelete(`/api/categories/${id}`);
        ToastService.success('Category deleted successfully');
    } catch (error) {
        console.error(`Failed to delete category ${id}:`, error);
        ToastService.error('Failed to delete category');
        throw error;
    }
};

/**
 * Archives a category.
 * @param {number} id - The ID of the category to archive.
 * @returns {Promise<void>}
 */
export const archiveCategory = async (id: number): Promise<void> => {
    try {
        await apiPatch(`/api/categories/${id}/archive`);
        ToastService.success('Category archived successfully');
    } catch (error) {
        console.error(`Failed to archive category ${id}:`, error);
        ToastService.error('Failed to archive category');
        throw error;
    }
};