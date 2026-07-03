import { Request, Response, NextFunction } from 'express';
import habitLogs from './habit-logs.ts';

const parseIntId = (value: string): number | null => {
    const id = Number.parseInt(value, 10);
    return Number.isNaN(id) ? null : id;
};

const sendNotFound = (res: Response): void => {
    res.status(404).json({ message: 'Resource not found' });
};

export default function habitLogsMiddleware(req: Request, res: Response, next: NextFunction): void {
    if (!req.path.startsWith('/habit-logs')) {
        next();
        return;
    }

    if (req.method === 'GET' && req.path === '/habit-logs') {
        res.json(habitLogs);
        return;
    }

    const byHabitMatch = req.path.match(/^\/habit-logs\/habit\/(\d+)$/);
    const byDateMatch = req.path.match(/^\/habit-logs\/date\/(\d{4}-\d{2}-\d{2})$/);
    const byRangeMatch = req.path.match(/^\/habit-logs\/habit\/(\d+)\/date-range$/);
    const logIdMatch = req.path.match(/^\/habit-logs\/(\d+)$/);

    if (byHabitMatch && req.method === 'GET') {
        const habitId = parseIntId(byHabitMatch[1]);
        let result = habitLogs.filter((log) => log.habitId === habitId);
        const limit = Number.parseInt(String(req.query.limit ?? ''), 10);
        if (!Number.isNaN(limit) && limit > 0) {
            result = result.slice(0, limit);
        }
        res.json(result);
        return;
    }

    if (byDateMatch && req.method === 'GET') {
        const date = byDateMatch[1];
        res.json(habitLogs.filter((log) => log.date === date));
        return;
    }

    if (byRangeMatch && req.method === 'GET') {
        const habitId = parseIntId(byRangeMatch[1]);
        const startDate = String(req.query.startDate ?? '');
        const endDate = String(req.query.endDate ?? '');
        const result = habitLogs.filter((log) => (
            log.habitId === habitId &&
            log.date >= startDate &&
            log.date <= endDate
        ));
        res.json(result);
        return;
    }

    if (logIdMatch) {
        const logId = parseIntId(logIdMatch[1]);
        const logIndex = habitLogs.findIndex((log) => log.id === logId);
        if (logIndex < 0) {
            sendNotFound(res);
            return;
        }

        if (req.method === 'PUT') {
            habitLogs[logIndex] = {
                ...habitLogs[logIndex],
                ...req.body,
                id: logId,
                updatedDate: new Date().toISOString(),
                updatedBy: 'test@example.com'
            };
            res.json(habitLogs[logIndex]);
            return;
        }

        if (req.method === 'DELETE') {
            habitLogs.splice(logIndex, 1);
            res.status(200).json({ message: 'Habit log deleted successfully' });
            return;
        }
    }

    if (req.method === 'POST' && req.path === '/habit-logs') {
        const now = new Date().toISOString();
        const newLog = {
            id: habitLogs.length ? Math.max(...habitLogs.map((l) => l.id)) + 1 : 1,
            habitId: req.body.habitId,
            value: req.body.value,
            date: req.body.date,
            notes: req.body.notes ?? '',
            createdDate: req.body.createdDate ?? now,
            updatedDate: now,
            createdBy: 'test@example.com',
            updatedBy: 'test@example.com'
        };
        habitLogs.push(newLog);
        res.status(201).json(newLog);
        return;
    }

    next();
}
