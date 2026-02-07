import { FormField } from '@/components/ui';
import { AuthLayout } from '@/components/ui';
import { useLoginForm } from '@/hooks/useForm';
import { Link } from 'react-router-dom';
import { LoginFormData } from '@/types';

export const Login = () => {
    const form = useLoginForm();
    const {
        control,
        handleSubmit,
        formState: { isSubmitting },
        onSubmit
    } = form;

    const handleFormSubmit = (_data: LoginFormData) => {
        // Form submission is handled by the hook
        onSubmit(_data);
    };

    return (
        <AuthLayout
            title="Login"
            subtitle="Enter your email below to login to your account"
            submitButtonText={isSubmitting ? 'Logging in...' : 'Login'}
            isLoading={isSubmitting}
            onSubmit={handleSubmit(handleFormSubmit)}
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
                name="email"
                control={control}
                type="email"
                label="Email"
                placeholder="m@example.com"
                required
            />

            <FormField
                name="password"
                control={control}
                type="password"
                label="Password"
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
