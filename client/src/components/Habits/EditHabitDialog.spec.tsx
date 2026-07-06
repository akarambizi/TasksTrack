import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, cleanup } from '@testing-library/react';
import { EditHabitDialog } from './EditHabitDialog';
import { renderWithProviders, mockHabit } from '../../utils/test-utils';

vi.mock('@/queries', () => ({
    useUpdateHabitMutation: vi.fn(),
}));

vi.mock('./HabitFormDialog', () => ({
    HabitFormDialog: vi.fn(({ title, description, submitLabel, open }: any) =>
        open ? (
            <div data-testid="habit-form-dialog-mock">
                <span>{title}</span>
                <span>{description}</span>
                <button type="button">{submitLabel}</button>
            </div>
        ) : null
    ),
}));

import * as habitQueries from '@/queries';
const mockUseUpdateHabitMutation = habitQueries.useUpdateHabitMutation as ReturnType<typeof vi.fn>;

describe('EditHabitDialog', () => {
    afterEach(() => cleanup());

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseUpdateHabitMutation.mockReturnValue({
            mutateAsync: vi.fn(),
            isPending: false,
            error: null,
        });
    });

    it('renders nothing when open is false', () => {
        renderWithProviders(
            <EditHabitDialog habit={mockHabit} open={false} onOpenChange={vi.fn()} />
        );
        expect(screen.queryByTestId('habit-form-dialog-mock')).not.toBeInTheDocument();
    });

    it('renders HabitFormDialog when open is true', () => {
        renderWithProviders(
            <EditHabitDialog habit={mockHabit} open={true} onOpenChange={vi.fn()} />
        );
        expect(screen.getByTestId('habit-form-dialog-mock')).toBeInTheDocument();
    });

    it('passes edit title to HabitFormDialog', () => {
        renderWithProviders(
            <EditHabitDialog habit={mockHabit} open={true} onOpenChange={vi.fn()} />
        );
        expect(screen.getByText('Edit Habit')).toBeInTheDocument();
    });

    it('passes Update Habit submit label', () => {
        renderWithProviders(
            <EditHabitDialog habit={mockHabit} open={true} onOpenChange={vi.fn()} />
        );
        expect(screen.getByRole('button', { name: /update habit/i })).toBeInTheDocument();
    });

    it('shows loading state when mutation is pending', () => {
        mockUseUpdateHabitMutation.mockReturnValue({
            mutateAsync: vi.fn(),
            isPending: true,
            error: null,
        });
        renderWithProviders(
            <EditHabitDialog habit={mockHabit} open={true} onOpenChange={vi.fn()} />
        );
        expect(screen.getByTestId('habit-form-dialog-mock')).toBeInTheDocument();
    });
});
