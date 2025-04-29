import { useForm } from '@/hooks';
import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Login } from './Login';

vi.mock('@/hooks', () => ({
    useForm: vi.fn(),
    FormType: {
        Login: 'Login',
    },
}));

describe('Login Component', () => {
    const mockHandleLoginSubmit = vi.fn();
    const mockHandleChange = vi.fn();

    beforeEach(() => {
        (useForm as ReturnType<typeof vi.fn>).mockReturnValue({
            formData: { email: '', password: '' },
            errors: {},
            handleChange: mockHandleChange,
            handleLoginSubmit: mockHandleLoginSubmit
        });
    });

    it('should render the login form', () => {
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        expect(screen.getByRole('heading', { name: 'Login' })).toBeTruthy();
        expect(screen.getByLabelText('Email')).toBeTruthy();
        expect(screen.getByLabelText('Password')).toBeTruthy();
        expect(screen.getByText('Forgot your password?')).toBeTruthy();
        expect(screen.getByTestId('signup-link')).toBeTruthy();
    });

    it('should call handleChange when email input changes', () => {
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        const emailInput = screen.getByLabelText('Email');
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

        expect(mockHandleChange).toHaveBeenCalledWith(expect.any(Object));
    });

    it('should call handleChange when password input changes', () => {
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        const passwordInput = screen.getByLabelText('Password');
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        expect(mockHandleChange).toHaveBeenCalledWith(expect.any(Object));
    });

    it('should call handleLoginSubmit when form is submitted', () => {
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        const form = screen.getByRole('form');
        fireEvent.submit(form);

        expect(mockHandleLoginSubmit).toHaveBeenCalled();
    });

    it('should display error messages when errors are present', () => {
        (useForm as ReturnType<typeof vi.fn>).mockReturnValue({
            formData: { email: '', password: '' },
            errors: { email: 'Invalid email', password: 'Password is required' },
            handleChange: mockHandleChange,
            handleLoginSubmit: mockHandleLoginSubmit
        });

        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        expect(screen.getByText('Invalid email')).toBeTruthy();
        expect(screen.getByText('Password is required')).toBeTruthy();
    });
});