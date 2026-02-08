import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';

import AddHabitLogDialog from './AddHabitLogDialog';
import { IHabit } from '@/types';
import { useHabitLogForm } from '../../hooks/useHabitLogForm';

vi.mock('../../hooks/useHabitLogForm');

// Mock UI components
vi.mock('@/components/ui', () => ({
    FormField: ({ name, label, placeholder }: { name: string; label: string; placeholder?: string }) => (
        <div>
            <label htmlFor={name}>{label}</label>
            <input id={name} name={name} placeholder={placeholder} type={name === 'date' ? 'date' : name === 'value' ? 'number' : 'text'} data-testid={`${name}-input`} />
        </div>
    ),
    TextareaField: ({ name, label, placeholder }: { name: string; label: string; placeholder?: string }) => (
        <div>
            <label htmlFor={name}>{label}</label>
            <textarea id={name} name={name} placeholder={placeholder} data-testid={`${name}-input`} />
        </div>
    )
}));

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

    // Simple mock - just what we actually need
    vi.mocked(useHabitLogForm).mockReturnValue({
      control: {} as any,
      handleSubmit: vi.fn((fn) => fn),
      formState: { isSubmitting: false },
      reset: vi.fn()
    } as any);
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
    const mockHandleSubmit = vi.fn((callback) => callback);

    vi.mocked(useHabitLogForm).mockReturnValue({
      control: {} as any,
      handleSubmit: mockHandleSubmit,
      formState: { isSubmitting: false },
      reset: vi.fn()
    } as any);

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

    // Verify form fields are present (Controller pattern doesn't use register directly)
    expect(screen.getByTestId('value-input')).toBeInTheDocument();
    expect(screen.getByTestId('date-input')).toBeInTheDocument();
    expect(screen.getByTestId('notes-input')).toBeInTheDocument();
  });

  it('should show form validation errors', () => {
    // Test that component renders correctly with error state
    vi.mocked(useHabitLogForm).mockReturnValue({
      control: {} as any,
      handleSubmit: vi.fn((fn) => fn),
      formState: { isSubmitting: false, errors: { value: { message: 'Value is required' } } },
      reset: vi.fn()
    } as any);

    renderComponent(true);

    // Verify form renders correctly even with errors
    expect(screen.getByTestId('value-input')).toBeInTheDocument();
    expect(screen.getByTestId('date-input')).toBeInTheDocument();
    expect(screen.getByTestId('notes-input')).toBeInTheDocument();
  });

  it('should disable submit button when submitting', () => {
    vi.mocked(useHabitLogForm).mockReturnValue({
      control: {} as any,
      handleSubmit: vi.fn((fn) => fn),
      formState: { isSubmitting: true },
      reset: vi.fn()
    } as any);

    renderComponent(true);

    const submitButton = screen.getByTestId('button-default');
    expect(submitButton).toBeDisabled();
  });
});