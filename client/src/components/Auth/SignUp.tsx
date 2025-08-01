import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormType, useForm } from '@/hooks';
import { Link, useNavigate } from 'react-router-dom';

export const SignUp = () => {
    const navigate = useNavigate();
    const { formData, errors, handleChange, isLoading, handleSubmit } = useForm({ email: '', password: '' }, FormType.Register);

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        const response = await handleSubmit(e);
        if (response?.success) {
            navigate('/login'); // Redirect to login page
        }
    };

    return (
        <form onSubmit={handleFormSubmit} className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
            <div className="flex items-center justify-center py-12">
                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="grid gap-2 text-center">
                        <h1 className="text-3xl font-bold">Sign Up</h1>
                        <p className="text-balance text-muted-foreground">Enter your information to create an account</p>
                    </div>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input name="email" type="email" placeholder="m@example.com" value={formData.email} onChange={handleChange} />
                            {errors.email && <p className="text-red-500">{errors.email}</p>}
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                                <Link to="/reset-password" className="ml-auto inline-block text-sm underline">
                                    Forgot your password?
                                </Link>
                            </div>
                            <Input name="password" type="password" value={formData.password} onChange={handleChange} required />
                            {errors.password && <p className="text-red-500">{errors.password}</p>}
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? 'Creating account...' : 'Create an account'}
                        </Button>
                        <Button variant="outline" className="w-full">
                            Sign up with Google
                        </Button>
                    </div>
                    <div className="mt-4 text-center text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="underline">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
            <div className="hidden bg-muted lg:block">
                <img
                    alt="login image"
                    className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                    height="100"
                    src="https://www.pictoclub.com/wp-content/uploads/2021/09/painting-brushes-scaled.jpg"
                    width="100"
                />
            </div>
        </form>
    );
};
