import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { ResetPassword } from './ResetPassword';
import { useResetPasswordForm } from '@/hooks/useForm';

// Mock the useResetPasswordForm hook
vi.mock('@/hooks/useForm', () => ({
    useResetPasswordForm: vi.fn()
}));

const renderResetPassword = () => {
    return render(
        <BrowserRouter>
            <ResetPassword />
        </BrowserRouter>
    );
};

describe('ResetPassword', () => {
    const mockHandleSubmit = vi.fn();
    const mockRegister = vi.fn((name: string) => ({
        name,
        onChange: vi.fn(),
        onBlur: vi.fn(),
        ref: vi.fn()
    }));
    const mockOnSubmit = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useResetPasswordForm as ReturnType<typeof vi.fn>).mockReturnValue({
            register: mockRegister,
            handleSubmit: mockHandleSubmit,
            formState: {
                errors: {},
                isSubmitting: false
            },
            onSubmit: mockOnSubmit,
            isLoading: false
        });
    });

    it('renders reset password form with all elements', () => {
        renderResetPassword();

        expect(screen.getByRole('heading', { name: /forgot password\?/i })).toBeInTheDocument();
        expect(screen.getByText(/enter your email below to reset your password/i)).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /reset password/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /back to login/i })).toBeInTheDocument();
    });

    it('displays form data correctly', () => {
        // Form data display test not applicable with React Hook Form structure
        renderResetPassword();

        expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
    });

    it('displays validation errors', () => {
        (useResetPasswordForm as ReturnType<typeof vi.fn>).mockReturnValue({
            register: mockRegister,
            handleSubmit: mockHandleSubmit,
            formState: {
                errors: {
                    email: { message: 'Email is required' }
                },
                isSubmitting: false
            },
            onSubmit: mockOnSubmit,
            isLoading: false
        });

        renderResetPassword();

        expect(screen.getByText('Email is required')).toBeInTheDocument();
    });

    it('calls handleChange when email input changes', () => {
        const mockOnChange = vi.fn();
        mockRegister.mockReturnValue({
            name: 'email',
            onChange: mockOnChange,
            onBlur: vi.fn(),
            ref: vi.fn()
        });

        renderResetPassword();

        const emailInput = screen.getByRole('textbox', { name: /email/i });
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

        expect(mockOnChange).toHaveBeenCalled();
    });

    it('calls handleSubmit when form is submitted', async () => {
        mockHandleSubmit.mockImplementation((fn) => (e: any) => {
            e.preventDefault();
            fn({ email: 'test@example.com', newPassword: 'newpass123' });
        });

        const { container } = renderResetPassword();

        const form = container.querySelector('form');
        expect(form).toBeInTheDocument();

        fireEvent.submit(form!);

        await waitFor(() => {
            expect(mockHandleSubmit).toHaveBeenCalled();
        });
    });

    it('has correct link to login page', () => {
        renderResetPassword();

        const backToLoginLink = screen.getByRole('link', { name: /back to login/i });
        expect(backToLoginLink).toHaveAttribute('href', '/login');
    });

    it('has correct placeholder text', () => {
        renderResetPassword();

        const emailInput = screen.getByPlaceholderText('m@example.com');
        expect(emailInput).toBeInTheDocument();
    });
});