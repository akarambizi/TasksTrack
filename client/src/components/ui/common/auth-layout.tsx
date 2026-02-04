import React from 'react';
import { Button } from '@/components/ui/button';

interface IAuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
    showGoogleButton?: boolean;
    submitButtonText: string;
    isLoading: boolean;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    footerContent: React.ReactNode;
    imageAlt?: string;
    imageUrl?: string;
}

const DEFAULT_AUTH_IMAGE = "https://www.pictoclub.com/wp-content/uploads/2021/09/painting-brushes-scaled.jpg";

export const AuthLayout: React.FC<IAuthLayoutProps> = ({
    children,
    title,
    subtitle,
    showGoogleButton = true,
    submitButtonText,
    isLoading,
    onSubmit,
    footerContent,
    imageAlt = "Authentication image",
    imageUrl = DEFAULT_AUTH_IMAGE
}) => {
    const handleGoogleAuth = () => {
        // TODO: Implement Google auth when needed
        console.log('Google auth not implemented');
    };

    return (
        <form role="form" onSubmit={onSubmit} className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
            <div className="flex items-center justify-center py-12">
                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="grid gap-2 text-center">
                        <h1 className="text-3xl font-bold">{title}</h1>
                        <p className="text-balance text-muted-foreground">{subtitle}</p>
                    </div>

                    <div className="grid gap-4">
                        {children}

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {submitButtonText}
                        </Button>

                        {showGoogleButton && (
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                onClick={handleGoogleAuth}
                            >
                                {title.includes('Sign') ? 'Sign up with Google' : 'Login with Google'}
                            </Button>
                        )}
                    </div>

                    <div className="mt-4 text-center text-sm" data-testid={title.toLowerCase().includes('sign') ? 'login-link' : 'signup-link'}>
                        {footerContent}
                    </div>
                </div>
            </div>

            <div className="hidden bg-muted lg:block">
                <img
                    alt={imageAlt}
                    className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                    height="100"
                    src={imageUrl}
                    width="100"
                />
            </div>
        </form>
    );
};