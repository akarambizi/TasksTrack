import type { IFocusSession } from '@/types';

const focusSessions: IFocusSession[] = [
    {
        id: 1,
        habitId: 1,
        startTime: '2026-07-01T09:00:00.000Z',
        endTime: '2026-07-01T10:30:00.000Z',
        plannedDurationMinutes: 90,
        notes: 'Feature implementation',
        createdBy: 'test@example.com',
        pauseTime: null,
        resumeTime: null,
        status: 'completed',
        actualDurationSeconds: 5400,
        pausedDurationSeconds: 0,
        createdDate: '2026-07-01T09:00:00.000Z'
    },
    {
        id: 2,
        habitId: 2,
        startTime: '2026-07-01T20:00:00.000Z',
        endTime: '2026-07-01T20:30:00.000Z',
        plannedDurationMinutes: 30,
        notes: 'Reading block',
        createdBy: 'test@example.com',
        pauseTime: null,
        resumeTime: null,
        status: 'completed',
        actualDurationSeconds: 1800,
        pausedDurationSeconds: 0,
        createdDate: '2026-07-01T20:00:00.000Z'
    }
];

export default focusSessions;
