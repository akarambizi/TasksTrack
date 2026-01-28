import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { SignUp } from './SignUp';
import * as useFormHook from '@/hooks/useForm';

// Mock the useForm hook
vi.mock('@/hooks/useForm', () => ({
    useForm: vi.fn(),
    FormType: {
        Register: 'register'
    }
}));

const MockedUseForm = useFormHook.useForm as ReturnType<typeof vi.fn>;

const renderSignUp = () => {
    return render(
        <BrowserRouter>
            <SignUp />
        </BrowserRouter>
    );
};

describe('SignUp', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders signup form with all elements', () => {
        MockedUseForm.mockReturnValue({
            formData: { email: '', password: '' },
            errors: {},
            handleChange: vi.fn(),
            isLoading: false,
            handleSubmit: vi.fn()
        });

        renderSignUp();

        expect(screen.getByRole('heading', { name: /sign up/i })).toBeInTheDocument();
        expect(screen.getByText(/enter your information to create an account/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /create an account/i })).toBeInTheDocument();
        expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument();
    });

    it('displays form data correctly', () => {
        MockedUseForm.mockReturnValue({
            formData: { email: 'test@example.com', password: 'password123' },
            errors: {},
            handleChange: vi.fn(),
            isLoading: false,
            handleSubmit: vi.fn()
        });

        renderSignUp();

        expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
        expect(screen.getByDisplayValue('password123')).toBeInTheDocument();
    });

    it('displays validation errors', () => {
        MockedUseForm.mockReturnValue({
            formData: { email: '', password: '' },
            errors: {
                email: 'Email is required',
                password: 'Password must be at least 8 characters'
            },
            handleChange: vi.fn(),
            isLoading: false,
            handleSubmit: vi.fn()
        });

        renderSignUp();

        expect(screen.getByText('Email is required')).toBeInTheDocument();
        expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
    });

    it('calls handleChange when input values change', () => {
        const mockHandleChange = vi.fn();
        MockedUseForm.mockReturnValue({
            formData: { email: '', password: '' },
            errors: {},
            handleChange: mockHandleChange,
            isLoading: false,
            handleSubmit: vi.fn()
        });

        renderSignUp();

        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        expect(mockHandleChange).toHaveBeenCalledTimes(2);

        // Verify the events were fired with the correct input elements
        expect(mockHandleChange).toHaveBeenNthCalledWith(1, expect.objectContaining({
            target: expect.objectContaining({ name: 'email' })
        }));
        expect(mockHandleChange).toHaveBeenNthCalledWith(2, expect.objectContaining({
            target: expect.objectContaining({ name: 'password' })
        }));
    });

    it('calls handleSubmit when form is submitted', async () => {
        const mockHandleSubmit = vi.fn().mockResolvedValue(undefined);
        MockedUseForm.mockReturnValue({
            formData: { email: 'test@example.com', password: 'password123' },
            errors: {},
            handleChange: vi.fn(),
            isLoading: false,
            handleSubmit: mockHandleSubmit
        });

        renderSignUp();

        const form = document.querySelector('form');
        expect(form).toBeInTheDocument();

        fireEvent.submit(form!);

        await waitFor(() => {
            expect(mockHandleSubmit).toHaveBeenCalledWith(expect.any(Object));
        });
    });

    it('shows loading state when form is submitting', () => {
        MockedUseForm.mockReturnValue({
            formData: { email: 'test@example.com', password: 'password123' },
            errors: {},
            handleChange: vi.fn(),
            isLoading: true,
            handleSubmit: vi.fn()
        });

        renderSignUp();

        const submitButton = screen.getByRole('button', { name: /creating/i });
        expect(submitButton).toBeInTheDocument();
        expect(submitButton).toBeDisabled();
    });

    it('has correct link to sign in page', () => {
        MockedUseForm.mockReturnValue({
            formData: { email: '', password: '' },
            errors: {},
            handleChange: vi.fn(),
            isLoading: false,
            handleSubmit: vi.fn()
        });

        renderSignUp();

        const signInLink = screen.getByRole('link', { name: /sign in/i });
        expect(signInLink).toHaveAttribute('href', '/login');
    });
});