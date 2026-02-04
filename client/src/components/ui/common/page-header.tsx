import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface IPageHeaderProps {
    title: string;
    subtitle?: string;
    backPath?: string;
    actions?: React.ReactNode;
    className?: string;
}

export const PageHeader: React.FC<IPageHeaderProps> = ({
    title,
    subtitle,
    backPath,
    actions,
    className = ''
}) => {
    const navigate = useNavigate();

    const handleBack = () => {
        if (backPath) {
            navigate(backPath);
        } else {
            navigate(-1);
        }
    };

    return (
        <div className={`flex items-center justify-between ${className}`}>
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBack}
                    className="p-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                    {subtitle && (
                        <p className="text-muted-foreground">{subtitle}</p>
                    )}
                </div>
            </div>
            {actions && (
                <div className="flex items-center gap-2">
                    {actions}
                </div>
            )}
        </div>
    );
};