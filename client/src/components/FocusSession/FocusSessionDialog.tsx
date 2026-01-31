import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Clock, Target } from 'lucide-react';
import { IHabit } from '@/api';
import { FocusTimer } from './FocusTimer';
import { Badge } from '@/components/ui/badge';
import { FocusTimerProvider } from '@/context/FocusTimerContext';

interface IFocusSessionDialogProps {
    habit: IHabit;
    trigger?: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export const FocusSessionDialog = ({
    habit,
    trigger,
    open: controlledOpen,
    onOpenChange
}: IFocusSessionDialogProps) => {
    const [internalOpen, setInternalOpen] = useState(false);
    const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
    const setOpen = onOpenChange || setInternalOpen;

    const defaultTrigger = (
        <Button variant="outline" size="sm" className="flex items-center gap-2" data-testid="focus-dialog-trigger">
            <Clock className="h-4 w-4" />
            Focus
        </Button>
    );

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || defaultTrigger}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden" data-testid="focus-dialog-content">
                <DialogHeader className="px-6 pt-6 pb-4">
                    <DialogTitle className="flex items-center gap-2" data-testid="dialog-title">
                        <Target className="h-5 w-5 text-blue-600" />
                        Focus Session
                    </DialogTitle>
                    <div className="flex items-center gap-2 pt-2">
                        <span className="text-sm text-muted-foreground">Working on:</span>
                        <Badge variant="outline" className="text-sm" data-testid="habit-badge">
                            {habit.name}
                        </Badge>
                    </div>
                    {habit.target && (
                        <div className="text-sm text-muted-foreground">
                            Target: {habit.target} {habit.unit} {habit.targetFrequency}
                        </div>
                    )}
                </DialogHeader>

                <div className="px-6 pb-6">
                    <FocusTimerProvider>
                        <FocusTimer
                            habit={habit}
                            className="border-0 shadow-none"
                        />
                    </FocusTimerProvider>
                </div>
            </DialogContent>
        </Dialog>
    );
};