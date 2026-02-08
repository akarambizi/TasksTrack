import { FormField } from '@/components/ui';
import { AuthLayout } from '@/components/ui';
import { useRegisterForm } from '@/hooks';
import { Link } from 'react-router-dom';

export const SignUp = () => {
    const form = useRegisterForm();
    const { control, handleSubmit, formState: { isSubmitting }, onSubmit } = form;

    return (
        <AuthLayout
            title="Sign Up"
            subtitle="Enter your information to create an account"
            submitButtonText={isSubmitting ? 'Creating account...' : 'Create an account'}
            isLoading={isSubmitting}
            onSubmit={handleSubmit(onSubmit)}
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
                name="name"
                control={control}
                type="text"
                label="Name"
                placeholder="Enter your full name"
                testId="name-input"
                required
            />

            <FormField
                name="email"
                control={control}
                type="email"
                label="Email"
                placeholder="m@example.com"
                testId="email-input"
                required
            />

            <FormField
                name="password"
                control={control}
                type="password"
                label="Password"
                testId="password-input"
                required
            />

            <FormField
                name="confirmPassword"
                control={control}
                type="password"
                label="Confirm Password"
                testId="confirm-password-input"
                required
            />
        </AuthLayout>
    );
};
