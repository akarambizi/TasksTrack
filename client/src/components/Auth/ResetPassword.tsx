import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormType, useForm } from '@/hooks';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ResetPassword = () => {
    const { formData, errors, handleChange, handleSubmit } = useForm({ email: '', newPassword: '' }, FormType.ResetPassword);

    return (
        <form onSubmit={handleSubmit} className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
            <div className="flex items-center justify-center py-12">
                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="grid gap-2 text-center">
                        <h1 className="text-3xl font-bold">Forgot Password?</h1>
                        <p className="text-balance text-muted-foreground">Enter your email below to reset your password.</p>
                    </div>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="m@example.com" value={formData.email} onChange={handleChange} />
                            {errors.email && <p className="text-red-500">{errors.email}</p>}
                        </div>
                        <Button type="submit" className="w-full">
                            Reset password
                        </Button>
                        <Link to="/login">
                            <Button variant="outline" className="w-full">
                                <ArrowLeft /> <span className="block mx-1">Back to Login</span>
                            </Button>
                        </Link>
                    </div>
                    <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?{' '}
                        <Link to="/signup" className="underline">
                            Sign up
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
