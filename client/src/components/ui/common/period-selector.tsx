import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export type TPeriodType = 'weekly' | 'monthly' | 'quarterly' | 'yearly';

interface IPeriodSelectorProps {
    period: TPeriodType;
    offset: number;
    onPeriodChange: (period: TPeriodType) => void;
    onOffsetChange: (offset: number) => void;
    className?: string;
}

const PERIOD_LABELS: Record<TPeriodType, string> = {
    weekly: 'Weekly',
    monthly: 'Monthly',
    quarterly: 'Quarterly',
    yearly: 'Yearly'
};

const PERIOD_OPTIONS: { value: TPeriodType; label: string }[] = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' }
];

export const PeriodSelector: React.FC<IPeriodSelectorProps> = ({
    period,
    offset,
    onPeriodChange,
    onOffsetChange,
    className = ''
}) => {
    const getCurrentPeriodLabel = () => {
        if (offset === 0) {
            return `Current ${PERIOD_LABELS[period].toLowerCase()}`;
        }
        
        const absOffset = Math.abs(offset);
        const suffix = absOffset === 1 ? '' : 's';
        
        if (offset < 0) {
            return `${absOffset} ${period.replace('ly', '').replace('ary', 'er')}${suffix} ago`;
        } else {
            return `${absOffset} ${period.replace('ly', '').replace('ary', 'er')}${suffix} ahead`;
        }
    };

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <Select value={period} onValueChange={onPeriodChange}>
                <SelectTrigger className="w-32">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {PERIOD_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <div className="flex items-center gap-1">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onOffsetChange(offset - 1)}
                    disabled={offset <= -12} // Prevent going too far back
                    className="p-2"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onOffsetChange(offset + 1)}
                    disabled={offset >= 0} // Prevent going into future
                    className="p-2"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>

            <span className="text-sm text-muted-foreground ml-2 min-w-0 flex-1">
                {getCurrentPeriodLabel()}
            </span>
        </div>
    );
};