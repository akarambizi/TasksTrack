import type { IHabit } from '@/types';

const habits: IHabit[] = [
    {
        id: 1,
        name: 'Deep Work',
        description: 'Uninterrupted coding block',
        metricType: 'duration',
        unit: 'minutes',
        target: 120,
        targetFrequency: 'daily',
        category: 'Work',
        isActive: true,
        createdDate: '2026-06-01T08:00:00.000Z',
        updatedDate: '2026-06-20T10:00:00.000Z',
        createdBy: 'test@example.com',
        updatedBy: 'test@example.com',
        color: '#2563EB',
        icon: 'Clock'
    },
    {
        id: 2,
        name: 'Reading',
        description: 'Read technical books',
        metricType: 'count',
        unit: 'pages',
        target: 20,
        targetFrequency: 'daily',
        category: 'Learning',
        isActive: true,
        createdDate: '2026-06-02T08:00:00.000Z',
        updatedDate: '2026-06-18T10:00:00.000Z',
        createdBy: 'test@example.com',
        updatedBy: 'test@example.com',
        color: '#059669',
        icon: 'BookOpen'
    },
    {
        id: 3,
        name: 'Workout',
        description: 'Strength session',
        metricType: 'duration',
        unit: 'minutes',
        target: 45,
        targetFrequency: 'daily',
        category: 'Health',
        isActive: true,
        createdDate: '2026-06-03T08:00:00.000Z',
        updatedDate: null,
        createdBy: 'test@example.com',
        updatedBy: null,
        color: '#DC2626',
        icon: 'Dumbbell'
    }
];

export default habits;
