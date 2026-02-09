import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { habitLogFormSchema } from '@/types';

export function useHabitLogForm(habitId?: number) {

    const defaultValues = {
        habitId: habitId || 0,
        value: '' as string | number, // Allow both types to match schema
        date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
        notes: ''
        // createdBy is now handled automatically by backend
    };

    return useForm({
        resolver: zodResolver(habitLogFormSchema),
        defaultValues,
        mode: 'onChange' // Validate on change for immediate feedback
    });
}