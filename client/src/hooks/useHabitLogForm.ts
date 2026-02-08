import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthContext } from '@/context/useAuthContext';
import { habitLogFormSchema, type HabitLogFormData } from '@/types';

export function useHabitLogForm(habitId?: number) {
    const { user } = useAuthContext();

    const defaultValues: HabitLogFormData = {
        habitId: habitId || 0,
        value: 0,
        date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
        notes: '',
        createdBy: user?.id || 'unknown'
    };

    return useForm<HabitLogFormData>({
        resolver: zodResolver(habitLogFormSchema),
        defaultValues,
        mode: 'onChange' // Validate on change for immediate feedback
    });
}