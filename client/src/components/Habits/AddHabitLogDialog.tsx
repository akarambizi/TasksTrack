import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

import { useEffect } from 'react';
import { useHabitLogForm } from '@/hooks/useHabitLogForm';
import { IHabit } from '@/types';
import { HabitLogFormData } from '@/types';

interface IAddHabitLogDialogProps {
    habit: IHabit;
    isOpen: boolean;
    onClose: () => void;
    onSubmitSuccess?: () => void;
}

export default function AddHabitLogDialog({ habit, isOpen, onClose, onSubmitSuccess }: IAddHabitLogDialogProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useHabitLogForm(habit.id);

    // Set default values when dialog opens
    useEffect(() => {
        if (isOpen) {
            const today = new Date().toISOString().split('T')[0];
            reset({
                date: today,
                habitId: habit.id,
                value: 0,
                notes: ''
            });
        }
    }, [isOpen, habit, reset]);

    const onSubmit = async (_data: HabitLogFormData) => {
        try {
            // The form hook handles the submission
            onSubmitSuccess?.();
            reset();
            onClose();
        } catch (error) {
            // Error handling is managed by the hook
            console.error('Form submission error:', error);
        }
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    if (!isOpen) return null;

    const displayUnit = habit.unit || habit.metricType || 'units';

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]" data-testid="add-habit-log-dialog">
                <form onSubmit={handleSubmit(onSubmit)} data-testid="habit-log-form">
                    <DialogHeader>
                        <DialogTitle>Add Log Entry</DialogTitle>
                        <DialogDescription>
                            Record your progress for {habit.name}. Target: {habit.target} {displayUnit}.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="value">Value ({displayUnit})</Label>
                            <Input
                                id="value"
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder={`Enter ${habit.metricType} (e.g., ${habit.target || 30})`}
                                {...register('value')}
                                data-testid="value-input"
                            />
                            {errors.value && (
                                <p className="text-sm text-red-600" data-testid="value-error">
                                    {errors.value.message}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="date">Date</Label>
                            <Input
                                id="date"
                                type="date"
                                {...register('date')}
                                data-testid="date-input"
                            />
                            {errors.date && (
                                <p className="text-sm text-red-600" data-testid="date-error">
                                    {errors.date.message}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="notes">Notes (Optional)</Label>
                            <Textarea
                                id="notes"
                                placeholder="How did it go? Any observations..."
                                rows={3}
                                {...register('notes')}
                                data-testid="notes-input"
                            />
                            {errors.notes && (
                                <p className="text-sm text-red-600" data-testid="notes-error">
                                    {errors.notes.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            data-testid="cancel-button"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-green-600 hover:bg-green-700"
                            data-testid="submit-button"
                        >
                            {isSubmitting ? 'Logging...' : 'Log Activity'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}