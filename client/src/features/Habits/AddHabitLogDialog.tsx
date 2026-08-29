import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FormField, TextareaField } from '@/components/ui';

import { useEffect } from 'react';
import { useHabitLogForm } from '@/hooks/useHabitLogForm';
import { useCreateHabitLogMutation } from '@/queries/habitLogs';
import { IHabit, HabitLogFormData } from '@/types';

interface IAddHabitLogDialogProps {
    habit: IHabit;
    isOpen: boolean;
    onClose: () => void;
    onSubmitSuccess?: () => void;
}

export default function AddHabitLogDialog({ habit, isOpen, onClose, onSubmitSuccess }: IAddHabitLogDialogProps) {
    const createHabitLogMutation = useCreateHabitLogMutation();
    const {
        control,
        handleSubmit,
        formState: { isSubmitting },
        reset
    } = useHabitLogForm(habit.id);

    // Set default values when dialog opens
    useEffect(() => {
        if (isOpen) {
            const today = new Date().toISOString().split('T')[0];
            reset({
                date: today,
                habitId: habit.id,
                value: '', // Start with empty string for better UX
                notes: ''
                // createdBy is now handled automatically by backend
            });
        }
    }, [isOpen, habit, reset]);

    const onSubmit = async (data: HabitLogFormData) => {
        try {
            await createHabitLogMutation.mutateAsync(data);
            onSubmitSuccess?.();
            reset();
            onClose();
        } catch (error) {
            // Error handling is managed by the mutation
            console.error('Form submission error:', error);
        }
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            handleClose();
        }
    };

    if (!isOpen) return null;

    const displayUnit = habit.unit || habit.metricType || 'units';

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[425px]" data-testid="add-habit-log-dialog">
                <form onSubmit={handleSubmit(onSubmit)} data-testid="habit-log-form">
                    <DialogHeader>
                        <DialogTitle>Add Log Entry</DialogTitle>
                        <DialogDescription>
                            Record your progress for {habit.name}. Target: {habit.target} {displayUnit}.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <FormField
                            name="value"
                            control={control}
                            type="number"
                            label={`Value (${displayUnit})`}
                            placeholder={`Enter ${habit.metricType} (e.g., ${habit.target || 30})`}
                            step="0.01"
                            min="0"
                            data-testid="value-input"
                            required
                        />

                        <FormField
                            name="date"
                            control={control}
                            type="date"
                            label="Date"
                            data-testid="date-input"
                            required
                        />

                        <TextareaField
                            name="notes"
                            control={control}
                            label="Notes (Optional)"
                            placeholder="How did it go? Any observations..."
                            rows={3}
                            data-testid="notes-input"
                        />
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
                            disabled={isSubmitting || createHabitLogMutation.isPending}
                            className="bg-green-600 hover:bg-green-700"
                            data-testid="submit-button"
                        >
                            {isSubmitting || createHabitLogMutation.isPending ? 'Logging...' : 'Log Activity'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}