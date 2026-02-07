import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AddHabitDialog } from './AddHabitDialog';
import * as useCreateHabitMutationHook from '@/queries/habits';
import * as useAuthContextHook from '@/context/useAuthContext';

// Don't mock useHabitForm - let it use the real implementation

vi.mock('@/queries/habits', () => ({
    useCreateHabitMutation: vi.fn()
}));

vi.mock('@/context/useAuthContext', () => ({
    useAuthContext: vi.fn()
}));

vi.mock('@/api/categories', () => ({
    getActiveCategories: vi.fn(() => Promise.resolve([
        { id: '1', name: 'Fitness', color: '#3B82F6', icon: 'fitness' },
        { id: '2', name: 'Health', color: '#10B981', icon: 'health' }
    ]))
}));

const MockedUseCreateHabitMutation = useCreateHabitMutationHook.useCreateHabitMutation as ReturnType<typeof vi.fn>;
const MockedUseAuthContext = useAuthContextHook.useAuthContext as ReturnType<typeof vi.fn>;

const renderAddHabitDialog = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false }
        }
    });

    return render(
        <QueryClientProvider client={queryClient}>
            <AddHabitDialog />
        </QueryClientProvider>
    );
};

describe('AddHabitDialog', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        MockedUseAuthContext.mockReturnValue({
            user: { email: 'test@example.com', id: 'test-user-id' }
        });

        MockedUseCreateHabitMutation.mockReturnValue({
            mutateAsync: vi.fn(),
            isPending: false,
            error: null
        });
    });

    it('renders add habit button', () => {
        renderAddHabitDialog();
        expect(screen.getByText('Add Habit')).toBeInTheDocument();
    });

    it('opens dialog when add habit button is clicked', async () => {
        renderAddHabitDialog();
        const button = screen.getByText('Add Habit');
        fireEvent.click(button);

        await waitFor(() => {
            expect(screen.getByText('Add New Habit')).toBeInTheDocument();
        });
    });

    it('displays form fields in dialog', async () => {
        renderAddHabitDialog();
        const button = screen.getByText('Add Habit');
        fireEvent.click(button);

        await waitFor(() => {
            expect(screen.getByLabelText(/habit name/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
        });
    });

    it('shows cancel and create buttons', async () => {
        renderAddHabitDialog();
        const button = screen.getByText('Add Habit');
        fireEvent.click(button);

        await waitFor(() => {
            expect(screen.getByText('Cancel')).toBeInTheDocument();
            expect(screen.getByText('Create Habit')).toBeInTheDocument();
        });
    });
});