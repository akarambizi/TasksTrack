import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus, LucideIcon } from 'lucide-react';

interface IAnalyticsCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    trend?: {
        value: number;
        isPositive: boolean;
        label?: string;
    };
    icon?: LucideIcon;
    className?: string;
}

export const AnalyticsCard: React.FC<IAnalyticsCardProps> = ({
    title,
    value,
    subtitle,
    trend,
    icon: Icon,
    className = ''
}) => {
    const getTrendIcon = () => {
        if (!trend) return null;
        
        if (Math.abs(trend.value) < 0.01) {
            return <Minus className="h-3 w-3 text-muted-foreground" />;
        }
        
        return trend.isPositive 
            ? <TrendingUp className="h-3 w-3 text-green-600" />
            : <TrendingDown className="h-3 w-3 text-red-600" />;
    };

    const getTrendColor = () => {
        if (!trend) return 'text-muted-foreground';
        if (Math.abs(trend.value) < 0.01) return 'text-muted-foreground';
        return trend.isPositive ? 'text-green-600' : 'text-red-600';
    };

    return (
        <Card className={className}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {Icon && (
                    <Icon className="h-4 w-4 text-muted-foreground" />
                )}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                
                <div className="flex items-center gap-2 mt-1">
                    {trend && (
                        <div className={`flex items-center gap-1 text-xs ${getTrendColor()}`}>
                            {getTrendIcon()}
                            <span>
                                {trend.value > 0 ? '+' : ''}{trend.value.toFixed(1)}%
                            </span>
                            {trend.label && (
                                <span className="text-muted-foreground">
                                    {trend.label}
                                </span>
                            )}
                        </div>
                    )}
                    
                    {subtitle && !trend && (
                        <p className="text-xs text-muted-foreground">
                            {subtitle}
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};