import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface IStatsCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon?: React.ReactNode;
    className?: string;
}

export const StatsCard: React.FC<IStatsCardProps> = ({
    title,
    value,
    subtitle,
    icon,
    className = ''
}) => {
    return (
        <Card className={className}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon && (
                    <div className="text-muted-foreground">
                        {icon}
                    </div>
                )}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {subtitle && (
                    <p className="text-xs text-muted-foreground mt-1">
                        {subtitle}
                    </p>
                )}
            </CardContent>
        </Card>
    );
};