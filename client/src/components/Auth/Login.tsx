import { FormField } from '@/components/ui/form-field';
import { AuthLayout } from '@/components/ui/auth-layout';
import { FormType, useForm } from '@/hooks';
import { Link } from 'react-router-dom';

export const Login = () => {
    const { formData, errors, isLoading, handleChange, handleSubmit } = useForm({ email: '', password: '' }, FormType.Login);

    return (
        <AuthLayout
            title="Login"
            subtitle="Enter your email below to login to your account"
            submitButtonText={isLoading ? 'Logging in...' : 'Login'}
            isLoading={isLoading}
            onSubmit={handleSubmit}
            footerContent={
                <>
                    Don&apos;t have an account?{' '}
                    <Link to="/signup" className="underline">
                        Sign up
                    </Link>
                </>
            }
            imageAlt="login image"
        >
            <FormField
                id="email"
                name="email"
                type="email"
                label="Email"
                placeholder="m@example.com"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
            />
            
            <FormField
                id="password"
                name="password"
                type="password"
                label="Password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                required
                labelAction={
                    <Link to="/reset-password" className="ml-auto inline-block text-sm underline">
                        Forgot your password?
                    </Link>
                }
            />
        </AuthLayout>
    );
};
