import React from 'react';
import { Badge } from '@/components/ui/badge';
import { IHabit } from '@/api';

interface IHabitInfoProps {
    habit: IHabit;
    showTarget?: boolean;
    className?: string;
    testId?: string;
}

export const HabitInfo: React.FC<IHabitInfoProps> = ({
    habit,
    showTarget = true,
    className = "",
    testId = "habit-info"
}) => {
    return (
        <div className={className} data-testid={testId}>
            <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Working on:</span>
                <Badge variant="outline" className="text-sm" data-testid="habit-badge">
                    {habit.name}
                </Badge>
            </div>
            {showTarget && habit.target && (
                <div className="text-sm text-muted-foreground mt-1">
                    Target: {habit.target} {habit.unit} {habit.targetFrequency}
                </div>
            )}
        </div>
    );
};