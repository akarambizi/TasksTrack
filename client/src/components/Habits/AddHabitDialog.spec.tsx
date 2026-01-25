import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AddHabitDialog } from './AddHabitDialog';
import * as useHabitFormHook from './useHabitForm';
import * as useCreateHabitMutationHook from '@/queries/habits';
import * as useAuthContextHook from '@/context/useAuthContext';

// Mock the hooks
vi.mock('./useHabitForm', () => ({
    useHabitForm: vi.fn()
}));

vi.mock('@/queries/habits', () => ({
    useCreateHabitMutation: vi.fn()
}));

vi.mock('@/context/useAuthContext', () => ({
    useAuthContext: vi.fn()
}));

const MockedUseHabitForm = useHabitFormHook.useHabitForm as ReturnType<typeof vi.fn>;
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
            user: { email: 'test@example.com' }
        });
        
        MockedUseHabitForm.mockReturnValue({
            formData: {
                name: '',
                description: '',
                metricType: '',
                unit: '',
                target: 0,
                targetFrequency: '',
                category: '',
                color: '',
                icon: ''
            },
            handleChange: vi.fn(),
            resetForm: vi.fn(),
            error: null,
            setError: vi.fn()
        });
        
        MockedUseCreateHabitMutation.mockReturnValue({
            mutateAsync: vi.fn(),
            isPending: false,
            error: null
        });
    });

    it('renders add habit button', () => {
        renderAddHabitDialog();
        
        expect(screen.getByRole('button', { name: /add habit/i })).toBeInTheDocument();
    });

    it('opens dialog when add habit button is clicked', async () => {
        renderAddHabitDialog();
        
        const addButton = screen.getByRole('button', { name: /add habit/i });
        fireEvent.click(addButton);

        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument();
            expect(screen.getByText(/add new habit/i)).toBeInTheDocument();
        });
    });

    it('displays all form fields in dialog', async () => {
        renderAddHabitDialog();
        
        const addButton = screen.getByRole('button', { name: /add habit/i });
        fireEvent.click(addButton);

        await waitFor(() => {
            expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
            expect(screen.getByText(/metric type/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/unit/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/daily target/i)).toBeInTheDocument();
            expect(screen.getByText('Category')).toBeInTheDocument();
        });
    });

    it('calls handleChange when form fields change', async () => {
        const mockHandleChange = vi.fn().mockReturnValue(vi.fn());
        MockedUseHabitForm.mockReturnValue({
            formData: {
                name: '',
                description: '',
                metricType: '',
                unit: '',
                target: 0,
                targetFrequency: '',
                category: '',
                color: '',
                icon: ''
            },
            handleChange: mockHandleChange,
            resetForm: vi.fn(),
            error: null,
            setError: vi.fn()
        });

        renderAddHabitDialog();
        
        const addButton = screen.getByRole('button', { name: /add habit/i });
        fireEvent.click(addButton);

        await waitFor(() => {
            const nameInput = screen.getByLabelText(/name/i);
            fireEvent.change(nameInput, { target: { value: 'Exercise' } });
            expect(mockHandleChange).toHaveBeenCalledWith('name');
        });
    });

    it('shows validation error when name is missing', async () => {
        const mockSetError = vi.fn();
        MockedUseHabitForm.mockReturnValue({
            formData: {
                name: '',
                description: '',
                metricType: 'time',
                unit: 'minutes',
                target: 30,
                targetFrequency: 'daily',
                category: 'health',
                color: '',
                icon: ''
            },
            handleChange: vi.fn(),
            resetForm: vi.fn(),
            error: null,
            setError: mockSetError
        });

        renderAddHabitDialog();
        
        const addButton = screen.getByRole('button', { name: /add habit/i });
        fireEvent.click(addButton);

        await waitFor(() => {
            const createButton = screen.getByRole('button', { name: /create habit/i });
            fireEvent.click(createButton);
            expect(mockSetError).toHaveBeenCalledWith('Name is required');
        });
    });

    it('shows validation error when metric type is missing', async () => {
        const mockSetError = vi.fn();
        MockedUseHabitForm.mockReturnValue({
            formData: {
                name: 'Exercise',
                description: '',
                metricType: '',
                unit: '',
                target: 0,
                targetFrequency: '',
                category: '',
                color: '',
                icon: ''
            },
            handleChange: vi.fn(),
            resetForm: vi.fn(),
            error: null,
            setError: mockSetError
        });

        renderAddHabitDialog();
        
        const addButton = screen.getByRole('button', { name: /add habit/i });
        fireEvent.click(addButton);

        await waitFor(() => {
            const createButton = screen.getByRole('button', { name: /create habit/i });
            fireEvent.click(createButton);
            expect(mockSetError).toHaveBeenCalledWith('Metric type is required');
        });
    });

    it('displays error message when there is an error', async () => {
        MockedUseHabitForm.mockReturnValue({
            formData: {
                name: '',
                description: '',
                metricType: '',
                unit: '',
                target: 0,
                targetFrequency: '',
                category: '',
                color: '',
                icon: ''
            },
            handleChange: vi.fn(),
            resetForm: vi.fn(),
            error: 'Something went wrong',
            setError: vi.fn()
        });

        renderAddHabitDialog();
        
        const addButton = screen.getByRole('button', { name: /add habit/i });
        fireEvent.click(addButton);

        await waitFor(() => {
            expect(screen.getByText('Something went wrong')).toBeInTheDocument();
        });
    });

    it('shows loading state when creating habit', async () => {
        MockedUseCreateHabitMutation.mockReturnValue({
            mutateAsync: vi.fn(),
            isPending: true,
            error: null
        });

        renderAddHabitDialog();
        
        const addButton = screen.getByRole('button', { name: /add habit/i });
        fireEvent.click(addButton);

        await waitFor(() => {
            expect(screen.getByText(/creating\.\.\./i)).toBeInTheDocument();
        });
    });

    it('calls mutateAsync when form is submitted with valid data', async () => {
        const mockMutateAsync = vi.fn().mockResolvedValue({});
        const mockResetForm = vi.fn();
        
        MockedUseCreateHabitMutation.mockReturnValue({
            mutateAsync: mockMutateAsync,
            isPending: false,
            error: null
        });

        MockedUseHabitForm.mockReturnValue({
            formData: {
                name: 'Exercise',
                description: 'Daily workout',
                metricType: 'time',
                unit: 'minutes',
                target: 30,
                targetFrequency: 'daily',
                category: 'health',
                color: '#blue',
                icon: 'dumbbell'
            },
            handleChange: vi.fn(),
            resetForm: mockResetForm,
            error: null,
            setError: vi.fn()
        });

        renderAddHabitDialog();
        
        const addButton = screen.getByRole('button', { name: /add habit/i });
        fireEvent.click(addButton);

        await waitFor(() => {
            const createButton = screen.getByRole('button', { name: /create habit/i });
            fireEvent.click(createButton);
        });

        await waitFor(() => {
            expect(mockMutateAsync).toHaveBeenCalledWith(expect.objectContaining({
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
                createdBy: 'test@example.com'
            }));
        });
    });
});