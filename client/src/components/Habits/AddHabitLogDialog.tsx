import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { useState } from 'react';
import { useHabitLogForm } from '@/hooks/useHabitLogForm';
import { useCreateHabitLogMutation } from '@/queries';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { IHabit } from '@/api';

interface IAddHabitLogDialogProps {
    habit: IHabit;
    trigger?: React.ReactNode;
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function AddHabitLogDialog({ habit, trigger, isOpen, onOpenChange }: IAddHabitLogDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false);
    const { formData, handleChange, resetForm, error, setError } = useHabitLogForm(habit.id);
    const createHabitLogMutation = useCreateHabitLogMutation();

    // Use external state if provided, otherwise use internal state
    const open = isOpen !== undefined ? isOpen : internalOpen;
    const setOpen = onOpenChange || setInternalOpen;

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form
        if (!formData.value || formData.value <= 0) {
            setError('Please enter a valid value greater than 0');
            return;
        }

        if (!formData.date) {
            setError('Please select a date');
            return;
        }

        setError(null);

        try {
            await createHabitLogMutation.mutateAsync(formData);
            resetForm();
            setOpen(false);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to log habit');
        }
    };

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen) {
            resetForm();
        }
    };

    const displayUnit = habit.unit || habit.metricType || 'units';

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            {trigger && (
                <DialogTrigger asChild>
                    {trigger}
                </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-[425px]" data-testid="add-habit-log-dialog">
                <form onSubmit={onSubmit} data-testid="habit-log-form">
                    <DialogHeader>
                        <DialogTitle>Log Activity: {habit.name}</DialogTitle>
                        <DialogDescription>
                            Record your progress for today. Target: {habit.target} {displayUnit} {habit.targetFrequency}.
                        </DialogDescription>
                    </DialogHeader>

                    {error && (
                        <Alert variant="destructive" className="mb-4" data-testid="error-alert">
                            <AlertDescription data-testid="error-message">{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="value">
                                Value ({displayUnit})
                            </Label>
                            <Input
                                id="value"
                                data-testid="value-input"
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder={`Enter ${habit.metricType} (e.g., ${habit.target || 30})`}
                                value={formData.value || ''}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    handleChange('value')(parseFloat(e.target.value) || 0)
                                }
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="date">Date</Label>
                            <Input
                                id="date"
                                data-testid="date-input"
                                type="date"
                                value={formData.date}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    handleChange('date')(e.target.value)
                                }
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="notes">Notes (Optional)</Label>
                            <Textarea
                                id="notes"
                                data-testid="notes-input"
                                placeholder="How did it go? Any observations..."
                                value={formData.notes || ''}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                    handleChange('notes')(e.target.value)
                                }
                                rows={3}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleOpenChange(false)}
                            data-testid="cancel-button"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={createHabitLogMutation.isPending}
                            className="bg-green-600 hover:bg-green-700"
                            data-testid="submit-button"
                        >
                            {createHabitLogMutation.isPending ? 'Logging...' : 'Log Activity'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}