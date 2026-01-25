import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AddHabitLogDialog } from './AddHabitLogDialog';
import { IHabit, IHabitLogCreateRequest } from '../../api';
import React from 'react';
import { useHabitLogForm } from '../../hooks/useHabitLogForm';
import { useCreateHabitLogMutation } from '../../queries/habitLogs';

// Mock the API and hooks
vi.mock('../../queries/habitLogs', () => ({
    useCreateHabitLogMutation: vi.fn(() => ({
        mutateAsync: vi.fn(),
        isPending: false,
    })),
}));

vi.mock('../../hooks/useHabitLogForm', () => ({
    useHabitLogForm: vi.fn(() => ({
        formData: {
            habitId: 1,
            value: 0,
            date: '2024-01-23',
            notes: '',
        },
        handleChange: vi.fn((_field: keyof IHabitLogCreateRequest) => (_value: string | number) => {}),
        resetForm: vi.fn(),
        error: null,
        setError: vi.fn(),
    })),
}));

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    });

    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};

const mockHabit: IHabit = {
    id: 1,
    name: 'Exercise',
    target: 30,
    unit: 'minutes',
    metricType: 'duration',
    targetFrequency: 'daily',
    isActive: true,
    createdDate: '2024-01-01T00:00:00Z',
    updatedDate: '2024-01-01T00:00:00Z',
    createdBy: 'user1',
    updatedBy: 'user1',
};

describe('AddHabitLogDialog', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders dialog with habit information', () => {
        const wrapper = createWrapper();

        render(
            <AddHabitLogDialog
                habit={mockHabit}
                isOpen={true}
                onOpenChange={vi.fn()}
            />,
            { wrapper }
        );

        expect(screen.getByTestId('add-habit-log-dialog')).toBeInTheDocument();
        expect(screen.getByText('Log Activity: Exercise')).toBeInTheDocument();
        expect(screen.getByText(/Target: 30 minutes daily/)).toBeInTheDocument();
    });

    it('renders form inputs with correct attributes', () => {
        const wrapper = createWrapper();

        render(
            <AddHabitLogDialog
                habit={mockHabit}
                isOpen={true}
                onOpenChange={vi.fn()}
            />,
            { wrapper }
        );

        const valueInput = screen.getByTestId('value-input');
        const dateInput = screen.getByTestId('date-input');
        const notesInput = screen.getByTestId('notes-input');

        expect(valueInput).toBeInTheDocument();
        expect(valueInput).toHaveAttribute('type', 'number');
        expect(valueInput).toHaveAttribute('min', '0');

        expect(dateInput).toBeInTheDocument();
        expect(dateInput).toHaveAttribute('type', 'date');

        expect(notesInput).toBeInTheDocument();
        expect(notesInput).toHaveAttribute('rows', '3');
    });

    it('renders submit and cancel buttons', () => {
        const wrapper = createWrapper();

        render(
            <AddHabitLogDialog
                habit={mockHabit}
                isOpen={true}
                onOpenChange={vi.fn()}
            />,
            { wrapper }
        );

        expect(screen.getByTestId('submit-button')).toBeInTheDocument();
        expect(screen.getByTestId('cancel-button')).toBeInTheDocument();
        expect(screen.getByText('Log Activity')).toBeInTheDocument();
        expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('calls onOpenChange when cancel button is clicked', () => {
        const wrapper = createWrapper();
        const onOpenChange = vi.fn();

        render(
            <AddHabitLogDialog
                habit={mockHabit}
                isOpen={true}
                onOpenChange={onOpenChange}
            />,
            { wrapper }
        );

        fireEvent.click(screen.getByTestId('cancel-button'));

        expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('displays error message when form has error', () => {
        // Mock the hook to return an error
        vi.mocked(useHabitLogForm).mockReturnValue({
            formData: {
                habitId: 1,
                value: 0,
                date: '2024-01-23',
                notes: '',
                createdBy: 'test-user'
            },
            setFormData: vi.fn(),
            handleChange: vi.fn((_field: keyof IHabitLogCreateRequest) => (_value: string | number) => {}),
            resetForm: vi.fn(),
            error: 'Please enter a valid value',
            setError: vi.fn(),
        });

        const wrapper = createWrapper();

        render(
            <AddHabitLogDialog
                habit={mockHabit}
                isOpen={true}
                onOpenChange={vi.fn()}
            />,
            { wrapper }
        );

        expect(screen.getByTestId('error-alert')).toBeInTheDocument();
        expect(screen.getByTestId('error-message')).toHaveTextContent('Please enter a valid value');
    });

    it('shows loading state when mutation is pending', () => {
        // Mock the mutation to be pending
        vi.mocked(useCreateHabitLogMutation).mockReturnValue({
            mutateAsync: vi.fn(),
            isPending: true,
            data: undefined,
            error: null,
            isError: false,
            isSuccess: false,
            isIdle: false,
            mutate: vi.fn(),
            reset: vi.fn(),
            variables: undefined,
            failureCount: 0,
            failureReason: null,
            status: 'pending',
            submittedAt: 0,
            isPaused: false,
        } as any);

        const wrapper = createWrapper();

        render(
            <AddHabitLogDialog
                habit={mockHabit}
                isOpen={true}
                onOpenChange={vi.fn()}
            />,
            { wrapper }
        );

        const submitButton = screen.getByTestId('submit-button');
        expect(submitButton).toBeDisabled();
        expect(screen.getByText('Logging...')).toBeInTheDocument();
    });

    it('handles form submission', async () => {
        const mockMutateAsync = vi.fn().mockResolvedValue({ id: 1 });
        const mockResetForm = vi.fn();
        const onOpenChange = vi.fn();

        // Mock the hooks
        vi.mocked(useCreateHabitLogMutation).mockReturnValue({
            mutateAsync: mockMutateAsync,
            isPending: false,
            data: undefined,
            error: null,
            isError: false,
            isSuccess: false,
            isIdle: true,
            mutate: vi.fn(),
            reset: vi.fn(),
            variables: undefined,
            failureCount: 0,
            failureReason: null,
            status: 'idle',
            submittedAt: 0,
            isPaused: false,
        } as any);

        vi.mocked(useHabitLogForm).mockReturnValue({
            formData: {
                habitId: 1,
                value: 30,
                date: '2024-01-23',
                notes: 'Great workout!',
                createdBy: 'test-user'
            },
            setFormData: vi.fn(),
            handleChange: vi.fn((_field: keyof IHabitLogCreateRequest) => (_value: string | number) => {}),
            resetForm: mockResetForm,
            error: null,
            setError: vi.fn(),
        });

        const wrapper = createWrapper();

        render(
            <AddHabitLogDialog
                habit={mockHabit}
                isOpen={true}
                onOpenChange={onOpenChange}
            />,
            { wrapper }
        );

        // Submit the form
        const form = screen.getByTestId('habit-log-form');
        fireEvent.submit(form);

        await waitFor(() => {
            expect(mockMutateAsync).toHaveBeenCalledWith({
                habitId: 1,
                value: 30,
                date: '2024-01-23',
                notes: 'Great workout!',
                createdBy: 'test-user',
            });
        });
    });

    it('handles habit with no unit or target', () => {
        const habitWithoutUnit = {
            ...mockHabit,
            unit: undefined,
            target: undefined,
        };

        const wrapper = createWrapper();

        render(
            <AddHabitLogDialog
                habit={habitWithoutUnit}
                isOpen={true}
                onOpenChange={vi.fn()}
            />,
            { wrapper }
        );

        expect(screen.getByText('Log Activity: Exercise')).toBeInTheDocument();
        expect(screen.getByLabelText(/Value \(duration\)/)).toBeInTheDocument();
    });

    it('handles internal state when no external state provided', () => {
        const wrapper = createWrapper();

        render(
            <AddHabitLogDialog habit={mockHabit} />,
            { wrapper }
        );

        // Should render without error even without external state management
        expect(screen.queryByTestId('add-habit-log-dialog')).not.toBeInTheDocument(); // Dialog closed by default
    });
});