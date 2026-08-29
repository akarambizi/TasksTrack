import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, cleanup, fireEvent } from '@testing-library/react';
import { ConfirmDeleteDialog } from './ConfirmDeleteDialog';
import { renderWithProviders, mockHabit } from '../../utils/test-utils';

vi.mock('@/queries', () => ({
    useDeleteHabitMutation: vi.fn(),
}));

import * as habitQueries from '@/queries';
const mockUseDeleteHabitMutation = habitQueries.useDeleteHabitMutation as ReturnType<typeof vi.fn>;

const mockMutateAsync = vi.fn();

describe('ConfirmDeleteDialog', () => {
    afterEach(() => cleanup());

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseDeleteHabitMutation.mockReturnValue({
            mutateAsync: mockMutateAsync,
            isPending: false,
            error: null,
        });
    });

    it('does not render when open is false', () => {
        renderWithProviders(
            <ConfirmDeleteDialog habit={mockHabit} open={false} onOpenChange={vi.fn()} />
        );
        expect(screen.queryByTestId('confirm-delete-dialog')).not.toBeInTheDocument();
    });

    it('renders dialog when open is true', () => {
        renderWithProviders(
            <ConfirmDeleteDialog habit={mockHabit} open={true} onOpenChange={vi.fn()} />
        );
        expect(screen.getByTestId('confirm-delete-dialog')).toBeInTheDocument();
    });

    it('displays habit name in dialog', () => {
        renderWithProviders(
            <ConfirmDeleteDialog habit={mockHabit} open={true} onOpenChange={vi.fn()} />
        );
        expect(screen.getByText(mockHabit.name, { exact: false })).toBeInTheDocument();
    });

    it('shows Delete Habit title', () => {
        renderWithProviders(
            <ConfirmDeleteDialog habit={mockHabit} open={true} onOpenChange={vi.fn()} />
        );
        expect(screen.getAllByText('Delete Habit').length).toBeGreaterThanOrEqual(1);
    });

    it('shows cancel button', () => {
        renderWithProviders(
            <ConfirmDeleteDialog habit={mockHabit} open={true} onOpenChange={vi.fn()} />
        );
        expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    it('shows delete button', () => {
        renderWithProviders(
            <ConfirmDeleteDialog habit={mockHabit} open={true} onOpenChange={vi.fn()} />
        );
        expect(screen.getByTestId('confirm-delete-button')).toBeInTheDocument();
    });

    it('calls onOpenChange(false) when cancel is clicked', () => {
        const onOpenChange = vi.fn();
        renderWithProviders(
            <ConfirmDeleteDialog habit={mockHabit} open={true} onOpenChange={onOpenChange} />
        );
        fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
        expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('calls mutateAsync when delete is clicked', async () => {
        mockMutateAsync.mockResolvedValue(undefined);
        const onOpenChange = vi.fn();
        renderWithProviders(
            <ConfirmDeleteDialog habit={mockHabit} open={true} onOpenChange={onOpenChange} />
        );
        fireEvent.click(screen.getByTestId('confirm-delete-button'));
        expect(mockMutateAsync).toHaveBeenCalledWith(mockHabit.id);
    });

    it('does not call mutateAsync when habit is null', () => {
        renderWithProviders(
            <ConfirmDeleteDialog habit={null} open={true} onOpenChange={vi.fn()} />
        );
        fireEvent.click(screen.getByTestId('confirm-delete-button'));
        expect(mockMutateAsync).not.toHaveBeenCalled();
    });

    it('shows deleting state when pending', () => {
        mockUseDeleteHabitMutation.mockReturnValue({
            mutateAsync: mockMutateAsync,
            isPending: true,
            error: null,
        });
        renderWithProviders(
            <ConfirmDeleteDialog habit={mockHabit} open={true} onOpenChange={vi.fn()} />
        );
        expect(screen.getByText(/deleting/i)).toBeInTheDocument();
    });

    it('disables buttons when pending', () => {
        mockUseDeleteHabitMutation.mockReturnValue({
            mutateAsync: mockMutateAsync,
            isPending: true,
            error: null,
        });
        renderWithProviders(
            <ConfirmDeleteDialog habit={mockHabit} open={true} onOpenChange={vi.fn()} />
        );
        expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled();
        expect(screen.getByTestId('confirm-delete-button')).toBeDisabled();
    });
});
