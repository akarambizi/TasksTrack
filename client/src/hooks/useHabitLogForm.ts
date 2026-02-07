import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthContext } from '@/context/useAuthContext';
import { habitLogFormSchema, type HabitLogFormData } from '@/types';

interface IUseHabitLogFormReturn {
    control: ReturnType<typeof useForm<HabitLogFormData>>['control'];
    formState: ReturnType<typeof useForm<HabitLogFormData>>['formState'];
    handleSubmit: ReturnType<typeof useForm<HabitLogFormData>>['handleSubmit'];
    reset: ReturnType<typeof useForm<HabitLogFormData>>['reset'];
    register: ReturnType<typeof useForm<HabitLogFormData>>['register'];
    watch: ReturnType<typeof useForm<HabitLogFormData>>['watch'];
    setValue: ReturnType<typeof useForm<HabitLogFormData>>['setValue'];
    getValues: ReturnType<typeof useForm<HabitLogFormData>>['getValues'];
    trigger: ReturnType<typeof useForm<HabitLogFormData>>['trigger'];
}

export function useHabitLogForm(habitId?: number): IUseHabitLogFormReturn {
    const { user } = useAuthContext();

    const defaultValues: HabitLogFormData = {
        habitId: habitId || 0,
        value: 0,
        date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
        notes: '',
        createdBy: user?.id || 'unknown'
    };

    const form = useForm<HabitLogFormData>({
        resolver: zodResolver(habitLogFormSchema),
        defaultValues,
        mode: 'onChange' // Validate on change for immediate feedback
    });

    return {
        control: form.control,
        formState: form.formState,
        handleSubmit: form.handleSubmit,
        reset: form.reset,
        register: form.register,
        watch: form.watch,
        setValue: form.setValue,
        getValues: form.getValues,
        trigger: form.trigger,
    };
}