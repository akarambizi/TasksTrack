import type { IHabitLog } from '@/types';

const habitLogs: IHabitLog[] = [
    {
        id: 1,
        habitId: 1,
        value: 90,
        date: '2026-07-01',
        notes: 'Strong session',
        createdDate: '2026-07-01T10:00:00.000Z',
        updatedDate: '2026-07-01T10:00:00.000Z',
        createdBy: 'test@example.com',
        updatedBy: 'test@example.com'
    },
    {
        id: 2,
        habitId: 2,
        value: 25,
        date: '2026-07-01',
        notes: 'Finished chapter 5',
        createdDate: '2026-07-01T21:00:00.000Z',
        updatedDate: '2026-07-01T21:00:00.000Z',
        createdBy: 'test@example.com',
        updatedBy: 'test@example.com'
    },
    {
        id: 3,
        habitId: 3,
        value: 40,
        date: '2026-06-30',
        notes: '',
        createdDate: '2026-06-30T18:00:00.000Z',
        updatedDate: '2026-06-30T18:00:00.000Z',
        createdBy: 'test@example.com',
        updatedBy: 'test@example.com'
    }
];

export default habitLogs;
