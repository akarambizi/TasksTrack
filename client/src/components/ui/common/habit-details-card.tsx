import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target } from 'lucide-react';
import { IHabit } from '@/types';

interface IHabitDetailsCardProps {
    habit: IHabit;
    testId?: string;
}

export const HabitDetailsCard: React.FC<IHabitDetailsCardProps> = ({ habit, testId }) => {
    const displayUnit = habit.unit || habit.metricType || 'units';

    return (
        <Card data-testid={testId}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Habit Details
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                    <div>
                        <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Target</div>
                        <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                            {habit.target} {displayUnit} {habit.targetFrequency}
                        </div>
                    </div>
                    <div>
                        <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Category</div>
                        <Badge variant="secondary" className="mt-1">
                            {habit.category || 'No Category'}
                        </Badge>
                    </div>
                    <div>
                        <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Status</div>
                        <Badge
                            variant={habit.isActive ? "default" : "secondary"}
                            className={`mt-1 ${habit.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : ''}`}
                        >
                            {habit.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};