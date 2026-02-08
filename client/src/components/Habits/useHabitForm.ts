import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DEFAULT_HABIT_FORM, getDefaultUnitForMetricType } from '@/types/constants';
import { habitFormSchema, type HabitFormData } from '@/types';

export function useHabitForm() {
    const defaultValues: HabitFormData = {
        name: '',
        description: '',
        metricType: DEFAULT_HABIT_FORM.metricType,
        unit: getDefaultUnitForMetricType(DEFAULT_HABIT_FORM.metricType),
        target: DEFAULT_HABIT_FORM.target,
        targetFrequency: DEFAULT_HABIT_FORM.targetFrequency,
        category: DEFAULT_HABIT_FORM.category,
        color: DEFAULT_HABIT_FORM.color,
        icon: DEFAULT_HABIT_FORM.icon,
    };

    return useForm<HabitFormData>({
        resolver: zodResolver(habitFormSchema),
        defaultValues,
        mode: 'onChange' // Validate on change for immediate feedback
    });
}
