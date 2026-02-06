import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSkeleton } from './loading-skeleton';

interface IChartCardProps {
    title: string;
    description?: string;
    children: React.ReactNode;
    isLoading?: boolean;
    error?: string | null;
    className?: string;
    headerActions?: React.ReactNode;
}

export const ChartCard: React.FC<IChartCardProps> = ({
    title,
    description,
    children,
    isLoading = false,
    error = null,
    className = '',
    headerActions
}) => {
    return (
        <Card className={className}>
            <CardHeader className={headerActions ? 'flex flex-row items-center justify-between space-y-0 pb-2' : undefined}>
                <div className="space-y-1">
                    <CardTitle className="text-base font-medium">{title}</CardTitle>
                    {description && (
                        <CardDescription>{description}</CardDescription>
                    )}
                </div>
                {headerActions && (
                    <div className="flex items-center gap-2">
                        {headerActions}
                    </div>
                )}
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="space-y-2">
                        <LoadingSkeleton className="h-[200px]" />
                        <div className="flex justify-between space-x-2">
                            <LoadingSkeleton className="h-4 w-16" />
                            <LoadingSkeleton className="h-4 w-20" />
                            <LoadingSkeleton className="h-4 w-18" />
                        </div>
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center h-48 text-muted-foreground">
                        <div className="text-center">
                            <p className="text-sm">Failed to load chart data</p>
                            <p className="text-xs mt-1">{error}</p>
                        </div>
                    </div>
                ) : (
                    <div className="w-full overflow-hidden">
                        {children}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};