import { Request, Response, NextFunction } from 'express';
import analytics from './analytics.ts';

export default function analyticsMiddleware(req: Request, res: Response, next: NextFunction): void {
    if (!req.path.startsWith('/analytics') || req.method !== 'GET') {
        next();
        return;
    }

    if (req.path === '/analytics/weekly') {
        res.json({ ...analytics, period: 'weekly' });
        return;
    }

    if (req.path === '/analytics/monthly') {
        res.json({ ...analytics, period: 'monthly' });
        return;
    }

    if (req.path === '/analytics/quarterly') {
        res.json({ ...analytics, period: 'quarterly' });
        return;
    }

    if (req.path === '/analytics/yearly') {
        res.json({ ...analytics, period: 'yearly' });
        return;
    }

    next();
}
