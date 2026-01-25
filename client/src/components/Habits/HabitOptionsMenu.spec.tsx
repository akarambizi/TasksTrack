import { render, screen, fireEvent } from '@testing-library/react';
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
    createdBy: 'test@example.com',
    createdAt: new Date(),
    updatedAt: new Date()
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

    it('opens dropdown menu when trigger is clicked', () => {
        renderHabitOptionsMenu();
        
        const trigger = screen.getByRole('button');
        fireEvent.click(trigger);

        expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('displays all menu options for active habit', () => {
        renderHabitOptionsMenu();
        
        const trigger = screen.getByRole('button');
        fireEvent.click(trigger);

        expect(screen.getByText(/view details/i)).toBeInTheDocument();
        expect(screen.getByText(/log activity/i)).toBeInTheDocument();
        expect(screen.getByText(/edit/i)).toBeInTheDocument();
        expect(screen.getByText(/archive/i)).toBeInTheDocument();
        expect(screen.getByText(/delete/i)).toBeInTheDocument();
    });

    it('displays activate option for archived habit', () => {
        const archivedHabit = { ...mockHabit, isActive: false };
        renderHabitOptionsMenu({ habit: archivedHabit });
        
        const trigger = screen.getByRole('button');
        fireEvent.click(trigger);

        expect(screen.getByText(/activate/i)).toBeInTheDocument();
        expect(screen.queryByText(/archive/i)).not.toBeInTheDocument();
    });

    it('calls onLogActivity when log activity is clicked', () => {
        const mockOnLogActivity = vi.fn();
        renderHabitOptionsMenu({ onLogActivity: mockOnLogActivity });
        
        const trigger = screen.getByRole('button');
        fireEvent.click(trigger);

        const logActivityOption = screen.getByText(/log activity/i);
        fireEvent.click(logActivityOption);

        expect(mockOnLogActivity).toHaveBeenCalledWith(mockHabit);
    });

    it('calls onEdit when edit is clicked', () => {
        const mockOnEdit = vi.fn();
        renderHabitOptionsMenu({ onEdit: mockOnEdit });
        
        const trigger = screen.getByRole('button');
        fireEvent.click(trigger);

        const editOption = screen.getByText(/edit/i);
        fireEvent.click(editOption);

        expect(mockOnEdit).toHaveBeenCalledWith(mockHabit);
    });

    it('calls archive mutation when archive is clicked', () => {
        const mockArchiveMutation = vi.fn();
        MockedUseArchiveHabitMutation.mockReturnValue({
            mutateAsync: mockArchiveMutation,
            isPending: false
        });

        renderHabitOptionsMenu();
        
        const trigger = screen.getByRole('button');
        fireEvent.click(trigger);

        const archiveOption = screen.getByText(/archive/i);
        fireEvent.click(archiveOption);

        expect(mockArchiveMutation).toHaveBeenCalledWith(1);
    });

    it('calls activate mutation when activate is clicked', () => {
        const mockActivateMutation = vi.fn();
        MockedUseActivateHabitMutation.mockReturnValue({
            mutateAsync: mockActivateMutation,
            isPending: false
        });

        const archivedHabit = { ...mockHabit, isActive: false };
        renderHabitOptionsMenu({ habit: archivedHabit });
        
        const trigger = screen.getByRole('button');
        fireEvent.click(trigger);

        const activateOption = screen.getByText(/activate/i);
        fireEvent.click(activateOption);

        expect(mockActivateMutation).toHaveBeenCalledWith(1);
    });

    it('calls delete mutation when delete is clicked', () => {
        const mockDeleteMutation = vi.fn();
        MockedUseDeleteHabitMutation.mockReturnValue({
            mutateAsync: mockDeleteMutation,
            isPending: false
        });

        renderHabitOptionsMenu();
        
        const trigger = screen.getByRole('button');
        fireEvent.click(trigger);

        const deleteOption = screen.getByText(/delete/i);
        fireEvent.click(deleteOption);

        expect(mockDeleteMutation).toHaveBeenCalledWith(1);
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