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
    },
    {
        id: 4,
        name: 'Personal',
        description: 'Personal development and life admin',
        color: '#8B5CF6',
        icon: 'UserCircle2',
        parentId: undefined,
        isActive: true,
        createdDate: '2026-06-01T08:00:00.000Z',
        updatedDate: '2026-06-24T08:00:00.000Z',
        createdBy: 'test@example.com',
        updatedBy: 'test@example.com'
    },
    {
        id: 5,
        name: 'Recovery',
        description: 'Rest, reset, and maintenance habits',
        color: '#F97316',
        icon: 'RefreshCcw',
        parentId: undefined,
        isActive: false,
        createdDate: '2026-06-01T08:00:00.000Z',
        updatedDate: '2026-06-22T08:00:00.000Z',
        createdBy: 'test@example.com',
        updatedBy: 'test@example.com'
    },
    {
        id: 6,
        name: 'Deep Work',
        description: 'Subcategory for uninterrupted focus sessions',
        color: '#1D4ED8',
        icon: 'Brain',
        parentId: 1,
        isActive: true,
        createdDate: '2026-06-10T08:00:00.000Z',
        updatedDate: '2026-06-27T08:00:00.000Z',
        createdBy: 'test@example.com',
        updatedBy: 'test@example.com'
    },
    {
        id: 7,
        name: 'Study Systems',
        description: 'Structured learning and note-taking',
        color: '#16A34A',
        icon: 'BookMarked',
        parentId: 2,
        isActive: true,
        createdDate: '2026-06-12T08:00:00.000Z',
        updatedDate: '2026-06-26T08:00:00.000Z',
        createdBy: 'test@example.com',
        updatedBy: 'test@example.com'
    },
    {
        id: 8,
        name: 'Training',
        description: 'Movement and fitness routines',
        color: '#EF4444',
        icon: 'Dumbbell',
        parentId: 3,
        isActive: true,
        createdDate: '2026-06-14T08:00:00.000Z',
        updatedDate: '2026-06-29T08:00:00.000Z',
        createdBy: 'test@example.com',
        updatedBy: 'test@example.com'
    }
];

export default categories;
