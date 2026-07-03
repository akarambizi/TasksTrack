import { Request, Response, NextFunction } from 'express';
import habits from './habits.ts';
import categories from '../categories/categories.ts';

const parseIntId = (value: string): number | null => {
    const id = Number.parseInt(value, 10);
    return Number.isNaN(id) ? null : id;
};

const sendNotFound = (res: Response): void => {
    res.status(404).json({ message: 'Resource not found' });
};

const addHabitWithCategory = (habit: any) => {
    const category = categories.find((c) => c.name === habit.category);
    return {
        ...habit,
        categoryId: category?.id
    };
};

export default function habitsMiddleware(req: Request, res: Response, next: NextFunction): void {
    if (!req.path.startsWith('/habits')) {
        next();
        return;
    }

    if (req.method === 'GET' && req.path === '/habits') {
        res.json(habits.map(addHabitWithCategory));
        return;
    }

    const habitIdMatch = req.path.match(/^\/habits\/(\d+)$/);
    const habitArchiveMatch = req.path.match(/^\/habits\/(\d+)\/archive$/);
    const habitActivateMatch = req.path.match(/^\/habits\/(\d+)\/activate$/);

    if (habitIdMatch) {
        const habitId = parseIntId(habitIdMatch[1]);
        if (!habitId) {
            sendNotFound(res);
            return;
        }

        const habitIndex = habits.findIndex((h) => h.id === habitId);
        if (habitIndex < 0) {
            sendNotFound(res);
            return;
        }

        if (req.method === 'GET') {
            res.json(addHabitWithCategory(habits[habitIndex]));
            return;
        }

        if (req.method === 'PUT') {
            habits[habitIndex] = {
                ...habits[habitIndex],
                ...req.body,
                id: habitId,
                updatedDate: new Date().toISOString(),
                updatedBy: 'test@example.com'
            };
            res.json(addHabitWithCategory(habits[habitIndex]));
            return;
        }

        if (req.method === 'DELETE') {
            habits.splice(habitIndex, 1);
            res.status(200).json({ message: 'Habit deleted successfully' });
            return;
        }
    }

    if (habitArchiveMatch && req.method === 'POST') {
        const habitId = parseIntId(habitArchiveMatch[1]);
        const habit = habits.find((h) => h.id === habitId);
        if (!habit) {
            sendNotFound(res);
            return;
        }
        habit.isActive = false;
        habit.updatedDate = new Date().toISOString();
        habit.updatedBy = 'test@example.com';
        res.json({ message: 'Habit archived successfully' });
        return;
    }

    if (habitActivateMatch && req.method === 'POST') {
        const habitId = parseIntId(habitActivateMatch[1]);
        const habit = habits.find((h) => h.id === habitId);
        if (!habit) {
            sendNotFound(res);
            return;
        }
        habit.isActive = true;
        habit.updatedDate = new Date().toISOString();
        habit.updatedBy = 'test@example.com';
        res.json({ message: 'Habit activated successfully' });
        return;
    }

    if (req.method === 'POST' && req.path === '/habits') {
        const now = new Date().toISOString();
        const newHabit = {
            id: habits.length ? Math.max(...habits.map((h) => h.id)) + 1 : 1,
            name: req.body.name,
            description: req.body.description ?? null,
            metricType: req.body.metricType ?? 'count',
            unit: req.body.unit ?? null,
            target: req.body.target ?? null,
            targetFrequency: req.body.targetFrequency ?? null,
            category: req.body.category ?? null,
            isActive: req.body.isActive ?? true,
            createdDate: now,
            updatedDate: now,
            createdBy: 'test@example.com',
            updatedBy: 'test@example.com',
            color: req.body.color ?? '#2563EB',
            icon: req.body.icon ?? 'Target'
        };
        habits.push(newHabit);
        res.status(201).json(addHabitWithCategory(newHabit));
        return;
    }

    next();
}
