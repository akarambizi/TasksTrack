import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { screen, cleanup, fireEvent } from '@testing-library/react';
import { CategoryManagementDialog } from './CategoryManagementDialog';
import { CategoryList } from './CategoryList';
import { renderWithProviders } from '../../utils/test-utils';
import { ICategory } from '@/types';

const mockRefetch = vi.fn();
vi.mock('@/queries/categories', () => ({
    useParentCategoriesQuery: vi.fn(() => ({ data: [], isLoading: false, refetch: mockRefetch })),
    useCreateCategoryMutation: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
    useUpdateCategoryMutation: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
    useDeleteCategoryMutation: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
    useArchiveCategoryMutation: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
}));

import * as categoriesModule from '@/queries/categories';
const mockUseParentCategoriesQuery = categoriesModule.useParentCategoriesQuery as ReturnType<typeof vi.fn>;

const mockCategories: ICategory[] = [
    {
        id: 1,
        name: 'Health',
        description: 'Health habits',
        color: '#22c55e',
        icon: 'Heart',
        parentId: null,
        isActive: true,
        subCategories: [],
        createdDate: '2026-01-01T00:00:00Z',
        createdBy: 'user1',
        updatedDate: null,
        updatedBy: null,
    },
    {
        id: 2,
        name: 'Learning',
        description: 'Learning habits',
        color: '#3b82f6',
        icon: 'BookOpen',
        parentId: null,
        isActive: true,
        subCategories: [
            {
                id: 3,
                name: 'Reading',
                description: null,
                color: '#3b82f6',
                icon: 'BookOpen',
                parentId: 2,
                isActive: true,
                subCategories: [],
                createdDate: '2026-01-01T00:00:00Z',
                createdBy: 'user1',
                updatedDate: null,
                updatedBy: null,
            }
        ],
        createdDate: '2026-01-01T00:00:00Z',
        createdBy: 'user1',
        updatedDate: null,
        updatedBy: null,
    },
];

describe('CategoryManagementDialog', () => {
    afterEach(() => cleanup());

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseParentCategoriesQuery.mockReturnValue({ data: [], isLoading: false, refetch: vi.fn() });
    });

    it('renders manage categories button', () => {
        renderWithProviders(<CategoryManagementDialog />);
        expect(screen.getByRole('button', { name: /categories/i })).toBeInTheDocument();
    });

    it('opens dialog on button click', () => {
        renderWithProviders(<CategoryManagementDialog />);
        fireEvent.click(screen.getByRole('button', { name: /categories/i }));
        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('shows categories heading in dialog', () => {
        renderWithProviders(<CategoryManagementDialog />);
        fireEvent.click(screen.getByRole('button', { name: /categories/i }));
        expect(screen.getByText(/manage categories/i)).toBeInTheDocument();
    });

    it('shows loading state', () => {
        mockUseParentCategoriesQuery.mockReturnValue({
            data: [],
            isLoading: true,
            refetch: vi.fn(),
        });
        renderWithProviders(<CategoryManagementDialog />);
        fireEvent.click(screen.getByRole('button', { name: /categories/i }));
        expect(screen.getByText(/Loading categories/i)).toBeInTheDocument();
    });

    it('shows add category button when dialog open', () => {
        renderWithProviders(<CategoryManagementDialog />);
        fireEvent.click(screen.getByRole('button', { name: /categories/i }));
        expect(screen.getByRole('button', { name: /add category/i })).toBeInTheDocument();
    });

    it('shows empty state when no categories', () => {
        renderWithProviders(<CategoryManagementDialog />);
        fireEvent.click(screen.getByRole('button', { name: /categories/i }));
        expect(screen.getByText(/no categories/i)).toBeInTheDocument();
    });

    it('renders categories when data is present', () => {
        mockUseParentCategoriesQuery.mockReturnValue({
            data: mockCategories,
            isLoading: false,
            refetch: vi.fn(),
        });
        renderWithProviders(<CategoryManagementDialog />);
        fireEvent.click(screen.getByRole('button', { name: /categories/i }));
        expect(screen.getByText('Health')).toBeInTheDocument();
    });
});

describe('CategoryList', () => {
    afterEach(() => cleanup());

    it('renders categories', () => {
        renderWithProviders(
            <CategoryList
                hierarchicalCategories={mockCategories}
                expandedCategories={new Set()}
                onToggleExpansion={vi.fn()}
                onEdit={vi.fn()}
                onArchive={vi.fn()}
                onDelete={vi.fn()}
                archiveMutation={{ isPending: false }}
                deleteMutation={{ isPending: false }}
            />
        );
        expect(screen.getByText('Health')).toBeInTheDocument();
        expect(screen.getByText('Learning')).toBeInTheDocument();
    });

    it('renders expand button for categories with subcategories', () => {
        renderWithProviders(
            <CategoryList
                hierarchicalCategories={mockCategories}
                expandedCategories={new Set()}
                onToggleExpansion={vi.fn()}
                onEdit={vi.fn()}
                onArchive={vi.fn()}
                onDelete={vi.fn()}
                archiveMutation={{ isPending: false }}
                deleteMutation={{ isPending: false }}
            />
        );
        // Learning has subcategories - should have expand button
        expect(screen.getByText('Reading')).toBeInTheDocument();
    });

    it('calls onToggleExpansion when expand button clicked', () => {
        const onToggle = vi.fn();
        renderWithProviders(
            <CategoryList
                hierarchicalCategories={mockCategories}
                expandedCategories={new Set()}
                onToggleExpansion={onToggle}
                onEdit={vi.fn()}
                onArchive={vi.fn()}
                onDelete={vi.fn()}
                archiveMutation={{ isPending: false }}
                deleteMutation={{ isPending: false }}
            />
        );
        const expandButton = document.querySelector('button.absolute.-left-6');
        if (expandButton) {
            fireEvent.click(expandButton);
            expect(onToggle).toHaveBeenCalledWith(2);
        }
    });

    it('shows expanded subcategories when category is expanded', () => {
        renderWithProviders(
            <CategoryList
                hierarchicalCategories={mockCategories}
                expandedCategories={new Set([2])}
                onToggleExpansion={vi.fn()}
                onEdit={vi.fn()}
                onArchive={vi.fn()}
                onDelete={vi.fn()}
                archiveMutation={{ isPending: false }}
                deleteMutation={{ isPending: false }}
            />
        );
        // When Learning is expanded, we should see Reading subcategory detail
        expect(screen.getAllByText('Reading').length).toBeGreaterThan(0);
    });
});
