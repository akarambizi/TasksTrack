import type { ICategory } from '@/types';

const categories: ICategory[] = [
    {
        id: 1,
        name: 'Work',
        description: 'Professional output',
        color: '#2563EB',
        icon: 'Briefcase',
        parentId: undefined,
        isActive: true,
        createdDate: '2026-06-01T08:00:00.000Z',
        updatedDate: '2026-06-01T08:00:00.000Z',
        createdBy: 'test@example.com',
        updatedBy: 'test@example.com'
    },
    {
        id: 2,
        name: 'Learning',
        description: 'Skill growth and study',
        color: '#059669',
        icon: 'GraduationCap',
        parentId: undefined,
        isActive: true,
        createdDate: '2026-06-01T08:00:00.000Z',
        updatedDate: '2026-06-01T08:00:00.000Z',
        createdBy: 'test@example.com',
        updatedBy: 'test@example.com'
    },
    {
        id: 3,
        name: 'Health',
        description: 'Fitness and wellbeing',
        color: '#DC2626',
        icon: 'HeartPulse',
        parentId: undefined,
        isActive: true,
        createdDate: '2026-06-01T08:00:00.000Z',
        updatedDate: '2026-06-01T08:00:00.000Z',
        createdBy: 'test@example.com',
        updatedBy: 'test@example.com'
    }
];

export default categories;
