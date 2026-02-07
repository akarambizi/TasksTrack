import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';

import AddHabitLogDialog from './AddHabitLogDialog';
import { IHabit } from '@/types';
import { useHabitLogForm } from '../../hooks/useHabitLogForm';

// Mock the hook with clean interface
const mockHandleSubmit = vi.fn();
const mockRegister = vi.fn();
const mockWatch = vi.fn();
const mockSetValue = vi.fn();
const mockGetValues = vi.fn();
const mockTrigger = vi.fn();
const mockReset = vi.fn();

vi.mock('../../hooks/useHabitLogForm');

// Mock Dialog component
vi.mock('../ui/dialog', () => ({
  Dialog: ({ children }: { children: React.ReactNode }) => <div data-testid="dialog">{children}</div>,
  DialogContent: ({ children }: { children: React.ReactNode }) => <div data-testid="dialog-content">{children}</div>,
  DialogHeader: ({ children }: { children: React.ReactNode }) => <div data-testid="dialog-header">{children}</div>,
  DialogTitle: ({ children }: { children: React.ReactNode }) => <h2 data-testid="dialog-title">{children}</h2>,
  DialogDescription: ({ children }: { children: React.ReactNode }) => <div data-testid="dialog-description">{children}</div>,
  DialogFooter: ({ children }: { children: React.ReactNode }) => <div data-testid="dialog-footer">{children}</div>
}));

// Mock Button component
vi.mock('../ui/button', () => ({
  Button: ({ children, onClick, type, variant, disabled }: any) => (
    <button
      data-testid={`button-${variant || 'default'}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  )
}));

// Mock Input component
vi.mock('../ui/input', () => ({
  Input: ({ ...props }: any) => <input data-testid="input" {...props} />
}));

// Mock Textarea component
vi.mock('../ui/textarea', () => ({
  Textarea: ({ ...props }: any) => <textarea data-testid="textarea" {...props} />
}));

// Mock Label component
vi.mock('../ui/label', () => ({
  Label: ({ children, ...props }: any) => <label data-testid="label" {...props}>{children}</label>
}));

describe('AddHabitLogDialog', () => {
  const mockHabit: IHabit = {
    id: 1,
    name: 'Test Habit',
    description: 'Test Description',
    metricType: 'count',
    isActive: true,
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString(),
    target: 10,
    unit: 'reps',
    createdBy: 'testuser',
    targetFrequency: 'daily',
    category: 'Health',
    updatedBy: null,
    color: null,
    icon: null
  };

  const mockOnClose = vi.fn();
  const mockOnSubmitSuccess = vi.fn();

  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
      }
    });
    vi.clearAllMocks();

    // Setup default mock return value
    vi.mocked(useHabitLogForm).mockReturnValue({
      control: vi.fn() as any,
      handleSubmit: mockHandleSubmit,
      formState: {
        errors: {},
        isSubmitting: false,
        isValid: true,
        isDirty: false,
        isLoading: false,
        isSubmitted: false,
        isSubmitSuccessful: false,
        submitCount: 0,
        touchedFields: {},
        dirtyFields: {},
        validatingFields: {},
        defaultValues: {}
      } as any,
      reset: mockReset,
      register: mockRegister,
      watch: mockWatch,
      setValue: mockSetValue,
      getValues: mockGetValues,
      trigger: mockTrigger,
    });
  });

  const renderComponent = (isOpen = true) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <AddHabitLogDialog
          isOpen={isOpen}
          onClose={mockOnClose}
          habit={mockHabit}
          onSubmitSuccess={mockOnSubmitSuccess}
        />
      </QueryClientProvider>
    );
  };

  it('should render dialog when isOpen is true', () => {
    renderComponent(true);

    expect(screen.getByTestId('dialog')).toBeInTheDocument();
    expect(screen.getByTestId('dialog-title')).toHaveTextContent('Add Log Entry');
  });

  it('should not render dialog when isOpen is false', () => {
    renderComponent(false);

    expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
  });

  it('should display habit name in dialog content', () => {
    renderComponent(true);

    expect(screen.getByText(/Test Habit/)).toBeInTheDocument();
  });

  it('should call handleSubmit when form is submitted', async () => {
    const user = userEvent.setup();
    mockHandleSubmit.mockImplementation((callback) => callback);

    renderComponent(true);

    await user.click(screen.getByTestId('button-default'));

    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it('should call onClose when cancel button is clicked', async () => {
    const user = userEvent.setup();
    renderComponent(true);

    const cancelButton = screen.getByTestId('button-outline');
    await user.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should register form fields', () => {
    renderComponent(true);

    // Verify register is called for expected fields
    expect(mockRegister).toHaveBeenCalledWith('value');
    expect(mockRegister).toHaveBeenCalledWith('notes');
    expect(mockRegister).toHaveBeenCalledWith('date');
  });

  it('should show form validation errors', () => {
    // Mock formState with errors
    vi.mocked(useHabitLogForm).mockReturnValue({
      control: vi.fn() as any,
      handleSubmit: mockHandleSubmit,
      formState: {
        errors: {
          value: { message: 'Value is required', type: 'custom' }
        },
        isSubmitting: false,
        isValid: false,
        isDirty: false,
        isLoading: false,
        isSubmitted: false,
        isSubmitSuccessful: false,
        submitCount: 0,
        touchedFields: {},
        dirtyFields: {},
        validatingFields: {},
        defaultValues: {}
      } as any,
      reset: vi.fn(),
      register: vi.fn(),
      watch: vi.fn(() => ({})) as any,
      setValue: vi.fn(),
      getValues: vi.fn(() => ({})) as any,
      trigger: vi.fn()
    });

    renderComponent(true);

    expect(screen.getByText('Value is required')).toBeInTheDocument();
  });

  it('should disable submit button when submitting', () => {
    // Mock submitting state
    vi.mocked(useHabitLogForm).mockReturnValue({
      control: vi.fn() as any,
      handleSubmit: mockHandleSubmit,
      formState: {
        errors: {},
        isSubmitting: true,
        isValid: true,
        isDirty: false,
        isLoading: false,
        isSubmitted: false,
        isSubmitSuccessful: false,
        submitCount: 0,
        touchedFields: {},
        dirtyFields: {},
        validatingFields: {},
        defaultValues: {}
      } as any,
      reset: vi.fn(),
      register: vi.fn(),
      watch: vi.fn(() => ({})) as any,
      setValue: vi.fn(),
      getValues: vi.fn(() => ({})) as any,
      trigger: vi.fn()
    });

    renderComponent(true);

    const submitButton = screen.getByTestId('button-default');
    expect(submitButton).toBeDisabled();
  });
});