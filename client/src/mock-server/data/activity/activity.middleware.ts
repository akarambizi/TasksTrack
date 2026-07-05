import { Request, Response, NextFunction } from 'express';
import { activityGrid, activityStatistics } from './activity.ts';

export default function activityMiddleware(req: Request, res: Response, next: NextFunction): void {
    if (!req.path.startsWith('/activity') || req.method !== 'GET') {
        next();
        return;
    }

    if (req.path === '/activity/grid') {
        res.json(activityGrid);
        return;
    }

    if (req.path === '/activity/statistics') {
        res.json(activityStatistics);
        return;
    }

    next();
}
