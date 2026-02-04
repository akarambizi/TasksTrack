import { FormField } from '@/components/ui';
import { AuthLayout } from '@/components/ui';
import { FormType, useForm } from '@/hooks';
import { Link } from 'react-router-dom';

export const SignUp = () => {
    const { formData, errors, handleChange, isLoading, handleSubmit } = useForm({ email: '', password: '' }, FormType.Register);

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        await handleSubmit(e);
    };

    return (
        <AuthLayout
            title="Sign Up"
            subtitle="Enter your information to create an account"
            submitButtonText={isLoading ? 'Creating account...' : 'Create an account'}
            isLoading={isLoading}
            onSubmit={handleFormSubmit}
            footerContent={
                <>
                    Already have an account?{' '}
                    <Link to="/login" className="underline">
                        Sign in
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
