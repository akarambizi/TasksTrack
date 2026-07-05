import { Request, Response, NextFunction } from 'express';
import type { IFocusSession } from '@/types';
import habits from '../habits/habits.ts';
import focusSessions from './focus-sessions.ts';

const mutableFocusSessions = focusSessions as IFocusSession[];

const sendNotFound = (res: Response): void => {
    res.status(404).json({ message: 'Resource not found' });
};

const addHabitToSession = (session: IFocusSession) => ({
    ...session,
    habit: habits.find((h) => h.id === session.habitId)
});

export default function focusMiddleware(req: Request, res: Response, next: NextFunction): void {
    if (!req.path.startsWith('/focus')) {
        next();
        return;
    }

    const now = new Date().toISOString();

    if (req.method === 'POST' && req.path === '/focus/start') {
        const newSession: IFocusSession = {
            id: mutableFocusSessions.length ? Math.max(...mutableFocusSessions.map((s) => s.id)) + 1 : 1,
            habitId: Number(req.body.habitId ?? 1),
            startTime: now,
            endTime: null,
            plannedDurationMinutes: Number(req.body.plannedDurationMinutes ?? 25),
            notes: String(req.body.notes ?? ''),
            createdBy: 'test@example.com',
            pauseTime: null,
            resumeTime: null,
            status: 'active',
            actualDurationSeconds: 0,
            pausedDurationSeconds: 0,
            createdDate: now
        };
        mutableFocusSessions.push(newSession);
        res.status(201).json(addHabitToSession(newSession));
        return;
    }

    if (req.method === 'POST' && req.path === '/focus/pause') {
        const activeSession = [...mutableFocusSessions].reverse().find((s) => s.status === 'active');
        if (!activeSession) {
            sendNotFound(res);
            return;
        }
        activeSession.status = 'paused';
        activeSession.pauseTime = now;
        res.json(addHabitToSession(activeSession));
        return;
    }

    if (req.method === 'POST' && req.path === '/focus/resume') {
        const pausedSession = [...mutableFocusSessions].reverse().find((s) => s.status === 'paused');
        if (!pausedSession) {
            sendNotFound(res);
            return;
        }
        pausedSession.status = 'active';
        pausedSession.resumeTime = now;
        res.json(addHabitToSession(pausedSession));
        return;
    }

    if (req.method === 'POST' && req.path === '/focus/complete') {
        const activeSession = [...mutableFocusSessions].reverse().find((s) => s.status === 'active' || s.status === 'paused');
        if (!activeSession) {
            sendNotFound(res);
            return;
        }
        const startMs = new Date(activeSession.startTime).getTime();
        const endMs = new Date(now).getTime();
        activeSession.status = 'completed';
        activeSession.endTime = now;
        activeSession.actualDurationSeconds = Math.max(0, Math.floor((endMs - startMs) / 1000));
        activeSession.notes = req.body?.notes ?? activeSession.notes;
        res.json(addHabitToSession(activeSession));
        return;
    }

    if (req.method === 'POST' && req.path === '/focus/cancel') {
        const activeSession = [...mutableFocusSessions].reverse().find((s) => s.status === 'active' || s.status === 'paused');
        if (!activeSession) {
            sendNotFound(res);
            return;
        }
        activeSession.status = 'interrupted';
        activeSession.endTime = now;
        activeSession.notes = req.body?.notes ?? activeSession.notes;
        res.json(addHabitToSession(activeSession));
        return;
    }

    if (req.method === 'GET' && req.path === '/focus/sessions') {
        res.json(mutableFocusSessions.map(addHabitToSession));
        return;
    }

    if (req.method === 'GET' && req.path === '/focus/active') {
        const active = [...mutableFocusSessions].reverse().find((s) => s.status === 'active' || s.status === 'paused');
        if (!active) {
            res.json(null);
            return;
        }
        res.json(addHabitToSession(active));
        return;
    }

    if (req.method === 'GET' && req.path === '/focus/analytics') {
        const completedSessions = mutableFocusSessions.filter((s) => s.status === 'completed');
        const totalSessions = mutableFocusSessions.length;
        const totalMinutes = Math.round(mutableFocusSessions.reduce((sum, s) => sum + (s.actualDurationSeconds / 60), 0));
        const longestSessionMinutes = Math.round(Math.max(0, ...mutableFocusSessions.map((s) => s.actualDurationSeconds / 60)));
        const averageSessionMinutes = totalSessions > 0 ? totalMinutes / totalSessions : 0;
        const completionRate = totalSessions > 0 ? (completedSessions.length / totalSessions) * 100 : 0;

        res.json({
            totalSessions,
            totalMinutes,
            completedSessions: completedSessions.length,
            averageSessionMinutes,
            longestSessionMinutes,
            currentStreak: 3,
            longestStreak: 12,
            completionRate
        });
        return;
    }

    next();
}
