import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HabitOptionsMenu } from './HabitOptionsMenu';
import { IHabit } from '@/types';
import { HABIT_COLORS, TARGET_FREQUENCY } from '@/types/constants';
import * as habitMutations from '@/queries/habits';
import { renderWithProviders, mockHabit, createMockMutation } from '../../utils/test-utils';

// Mock the habit mutation hooks
vi.mock('@/queries/habits', () => ({
    useDeleteHabitMutation: vi.fn(),
    useArchiveHabitMutation: vi.fn(),
    useActivateHabitMutation: vi.fn()
}));

const MockedUseDeleteHabitMutation = habitMutations.useDeleteHabitMutation as ReturnType<typeof vi.fn>;
const MockedUseArchiveHabitMutation = habitMutations.useArchiveHabitMutation as ReturnType<typeof vi.fn>;
const MockedUseActivateHabitMutation = habitMutations.useActivateHabitMutation as ReturnType<typeof vi.fn>;

// Use test habit with specific properties for this test
const testHabit: IHabit = {
    ...mockHabit,
    id: 1,
    name: 'Exercise',
    description: 'Daily workout',
    metricType: 'duration',
    unit: 'minutes',
    target: 30,
    targetFrequency: TARGET_FREQUENCY.DAILY,
    category: 'Health',
    color: HABIT_COLORS.BLUE,
    icon: 'dumbbell',
    isActive: true
};

const renderHabitOptionsMenu = (props: Partial<React.ComponentProps<typeof HabitOptionsMenu>> = {}) => {
    return renderWithProviders(<HabitOptionsMenu habit={testHabit} {...props} />);
};

describe('HabitOptionsMenu', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        MockedUseDeleteHabitMutation.mockReturnValue(
            createMockMutation({ mutateAsync: vi.fn() })
        );

        MockedUseArchiveHabitMutation.mockReturnValue(
            createMockMutation({ mutateAsync: vi.fn() })
        );

        MockedUseActivateHabitMutation.mockReturnValue(
            createMockMutation({ mutateAsync: vi.fn() })
        );
    });

    it('renders options menu trigger button', () => {
        renderHabitOptionsMenu();

        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('opens dropdown menu when trigger is clicked', async () => {
        const user = userEvent.setup();
        renderHabitOptionsMenu();

        const trigger = screen.getByRole('button');
        await user.click(trigger);

        // Wait for the menu content to appear - it may take a moment with Radix UI
        await waitFor(() => {
            expect(screen.getByText(/View Details/i)).toBeInTheDocument();
        });
    });

    it('displays all menu options for active habit', async () => {
        const user = userEvent.setup();
        renderHabitOptionsMenu();

        const trigger = screen.getByRole('button');
        await user.click(trigger);

        await waitFor(() => {
            expect(screen.getByText(/View Details/i)).toBeInTheDocument();
            expect(screen.getByText(/Log Activity/i)).toBeInTheDocument();
            expect(screen.getByText(/Edit Habit/i)).toBeInTheDocument();
            expect(screen.getByText(/Archive Habit/i)).toBeInTheDocument();
            expect(screen.getByText(/Delete Habit/i)).toBeInTheDocument();
        });
    });

    it('displays activate option for archived habit', async () => {
        const user = userEvent.setup();
        const archivedHabit = { ...mockHabit, isActive: false };
        renderHabitOptionsMenu({ habit: archivedHabit });

        const trigger = screen.getByRole('button');
        await user.click(trigger);

        await waitFor(() => {
            expect(screen.getByText(/Activate Habit/i)).toBeInTheDocument();
            expect(screen.queryByText(/Archive Habit/i)).not.toBeInTheDocument();
        });
    });

    it('calls onLogActivity when log activity is clicked', async () => {
        const user = userEvent.setup();
        const mockOnLogActivity = vi.fn();
        renderHabitOptionsMenu({ onLogActivity: mockOnLogActivity });

        const trigger = screen.getByRole('button');
        await user.click(trigger);

        const logActivityOption = await screen.findByText(/Log Activity/i);
        await user.click(logActivityOption);

        expect(mockOnLogActivity).toHaveBeenCalledWith(testHabit);
    });

    it('calls onEdit when edit is clicked', async () => {
        const user = userEvent.setup();

        const mockOnEdit = vi.fn();
        renderHabitOptionsMenu({ onEdit: mockOnEdit });

        const trigger = screen.getByRole('button');
        await user.click(trigger);

        const editOption = await screen.findByText(/Edit Habit/i);
        await user.click(editOption);

        expect(mockOnEdit).toHaveBeenCalledWith(testHabit);
    });

    it('calls archive mutation when archive is clicked', async () => {
        const user = userEvent.setup();

        const mockArchiveMutation = vi.fn();
        MockedUseArchiveHabitMutation.mockReturnValue({
            mutate: mockArchiveMutation,
            isPending: false
        });

        renderHabitOptionsMenu();

        const trigger = screen.getByRole('button');
        await user.click(trigger);

        const archiveOption = await screen.findByText(/Archive Habit/i);
        await user.click(archiveOption);

        expect(mockArchiveMutation).toHaveBeenCalledWith(1);
    });

    it('calls activate mutation when activate is clicked', async () => {
        const user = userEvent.setup();

        const mockActivateMutation = vi.fn();
        MockedUseActivateHabitMutation.mockReturnValue({
            mutate: mockActivateMutation,
            isPending: false
        });

        const archivedHabit = { ...mockHabit, isActive: false };
        renderHabitOptionsMenu({ habit: archivedHabit });

        const trigger = screen.getByRole('button');
        await user.click(trigger);

        const activateOption = await screen.findByText(/Activate Habit/i);
        await user.click(activateOption);

        expect(mockActivateMutation).toHaveBeenCalledWith(1);
    });

    it('calls onDelete when delete is clicked', async () => {
        const user = userEvent.setup();

        const mockOnDelete = vi.fn();

        renderHabitOptionsMenu({ onDelete: mockOnDelete });

        const trigger = screen.getByRole('button');
        await user.click(trigger);

        const deleteOption = await screen.findByText(/Delete Habit/i);
        await user.click(deleteOption);

        expect(mockOnDelete).toHaveBeenCalledWith(testHabit);
    });

    it('disables trigger when mutations are pending', () => {
        MockedUseDeleteHabitMutation.mockReturnValue({
            mutateAsync: vi.fn(),
            isPending: true
        });

        renderHabitOptionsMenu();

        const trigger = screen.getByRole('button');
        expect(trigger).toBeDisabled();
    });

    it('shows loading state when archive mutation is pending', () => {
        MockedUseArchiveHabitMutation.mockReturnValue({
            mutateAsync: vi.fn(),
            isPending: true
        });

        renderHabitOptionsMenu();

        const trigger = screen.getByRole('button');
        expect(trigger).toBeDisabled();
    });

    it('shows loading state when activate mutation is pending', () => {
        MockedUseActivateHabitMutation.mockReturnValue({
            mutateAsync: vi.fn(),
            isPending: true
        });

        renderHabitOptionsMenu();

        const trigger = screen.getByRole('button');
        expect(trigger).toBeDisabled();
    });
});