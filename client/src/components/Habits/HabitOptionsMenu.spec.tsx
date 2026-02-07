import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { HabitOptionsMenu } from './HabitOptionsMenu';
import { IHabit } from '@/api';
import * as habitMutations from '@/queries/habits';

// Mock the habit mutation hooks
vi.mock('@/queries/habits', () => ({
    useDeleteHabitMutation: vi.fn(),
    useArchiveHabitMutation: vi.fn(),
    useActivateHabitMutation: vi.fn()
}));

const MockedUseDeleteHabitMutation = habitMutations.useDeleteHabitMutation as ReturnType<typeof vi.fn>;
const MockedUseArchiveHabitMutation = habitMutations.useArchiveHabitMutation as ReturnType<typeof vi.fn>;
const MockedUseActivateHabitMutation = habitMutations.useActivateHabitMutation as ReturnType<typeof vi.fn>;

const mockHabit: IHabit = {
    id: 1,
    name: 'Exercise',
    description: 'Daily workout',
    metricType: 'time',
    unit: 'minutes',
    target: 30,
    targetFrequency: 'daily',
    category: 'health',
    color: '#blue',
    icon: 'dumbbell',
    isActive: true,
    createdBy: 'test-user-id',
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString()
};

const renderHabitOptionsMenu = (props: Partial<React.ComponentProps<typeof HabitOptionsMenu>> = {}) => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false }
        }
    });

    return render(
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <HabitOptionsMenu habit={mockHabit} {...props} />
            </BrowserRouter>
        </QueryClientProvider>
    );
};

describe('HabitOptionsMenu', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        MockedUseDeleteHabitMutation.mockReturnValue({
            mutateAsync: vi.fn(),
            isPending: false
        });

        MockedUseArchiveHabitMutation.mockReturnValue({
            mutateAsync: vi.fn(),
            isPending: false
        });

        MockedUseActivateHabitMutation.mockReturnValue({
            mutateAsync: vi.fn(),
            isPending: false
        });
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

        expect(mockOnLogActivity).toHaveBeenCalledWith(mockHabit);
    });

    it('calls onEdit when edit is clicked', async () => {
        const user = userEvent.setup();

        const mockOnEdit = vi.fn();
        renderHabitOptionsMenu({ onEdit: mockOnEdit });

        const trigger = screen.getByRole('button');
        await user.click(trigger);

        const editOption = await screen.findByText(/Edit Habit/i);
        await user.click(editOption);

        expect(mockOnEdit).toHaveBeenCalledWith(mockHabit);
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

        expect(mockOnDelete).toHaveBeenCalledWith(mockHabit);
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