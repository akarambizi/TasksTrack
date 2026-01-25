import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { ResetPassword } from './ResetPassword';
import * as useFormHook from '@/hooks/useForm';

// Mock the useForm hook
vi.mock('@/hooks/useForm', () => ({
    useForm: vi.fn(),
    FormType: {
        ResetPassword: 'resetPassword'
    }
}));

const MockedUseForm = useFormHook.useForm as ReturnType<typeof vi.fn>;

const renderResetPassword = () => {
    return render(
        <BrowserRouter>
            <ResetPassword />
        </BrowserRouter>
    );
};

describe('ResetPassword', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders reset password form with all elements', () => {
        MockedUseForm.mockReturnValue({
            formData: { email: '', newPassword: '' },
            errors: {},
            handleChange: vi.fn(),
            isLoading: false,
            handleSubmit: vi.fn()
        });

        renderResetPassword();
        
        expect(screen.getByRole('heading', { name: /forgot password\?/i })).toBeInTheDocument();
        expect(screen.getByText(/enter your email below to reset your password/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /reset password/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /back to login/i })).toBeInTheDocument();
    });

    it('displays form data correctly', () => {
        MockedUseForm.mockReturnValue({
            formData: { email: 'test@example.com', newPassword: '' },
            errors: {},
            handleChange: vi.fn(),
            isLoading: false,
            handleSubmit: vi.fn()
        });

        renderResetPassword();
        
        expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
    });

    it('displays validation errors', () => {
        MockedUseForm.mockReturnValue({
            formData: { email: '', newPassword: '' },
            errors: { 
                email: 'Email is required'
            },
            handleChange: vi.fn(),
            isLoading: false,
            handleSubmit: vi.fn()
        });

        renderResetPassword();
        
        expect(screen.getByText('Email is required')).toBeInTheDocument();
    });

    it('calls handleChange when email input changes', () => {
        const mockHandleChange = vi.fn();
        MockedUseForm.mockReturnValue({
            formData: { email: '', newPassword: '' },
            errors: {},
            handleChange: mockHandleChange,
            isLoading: false,
            handleSubmit: vi.fn()
        });

        renderResetPassword();
        
        const emailInput = screen.getByLabelText(/email/i);
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

        expect(mockHandleChange).toHaveBeenCalledWith(expect.objectContaining({
            target: expect.objectContaining({ value: 'test@example.com' })
        }));
    });

    it('calls handleSubmit when form is submitted', async () => {
        const mockHandleSubmit = vi.fn().mockResolvedValue(undefined);
        MockedUseForm.mockReturnValue({
            formData: { email: 'test@example.com', newPassword: '' },
            errors: {},
            handleChange: vi.fn(),
            isLoading: false,
            handleSubmit: mockHandleSubmit
        });

        renderResetPassword();
        
        const form = screen.getByRole('form') || screen.getByTestId('reset-form') || document.querySelector('form');
        expect(form).toBeInTheDocument();
        
        fireEvent.submit(form!);

        await waitFor(() => {
            expect(mockHandleSubmit).toHaveBeenCalledWith(expect.any(Object));
        });
    });

    it('has correct link to login page', () => {
        MockedUseForm.mockReturnValue({
            formData: { email: '', newPassword: '' },
            errors: {},
            handleChange: vi.fn(),
            isLoading: false,
            handleSubmit: vi.fn()
        });

        renderResetPassword();
        
        const backToLoginLink = screen.getByRole('link', { name: /back to login/i });
        expect(backToLoginLink).toHaveAttribute('href', '/login');
    });

    it('has correct placeholder text', () => {
        MockedUseForm.mockReturnValue({
            formData: { email: '', newPassword: '' },
            errors: {},
            handleChange: vi.fn(),
            isLoading: false,
            handleSubmit: vi.fn()
        });

        renderResetPassword();
        
        const emailInput = screen.getByPlaceholderText('m@example.com');
        expect(emailInput).toBeInTheDocument();
    });
});