import { Request, Response, NextFunction, RequestHandler } from 'express';
import habitsMiddleware from './habits/habits.middleware.ts';
import habitLogsMiddleware from './habit-logs/habit-logs.middleware.ts';
import categoriesMiddleware from './categories/categories.middleware.ts';
import focusMiddleware from './focus/focus.middleware.ts';
import analyticsMiddleware from './analytics/analytics.middleware.ts';
import activityMiddleware from './activity/activity.middleware.ts';

const apiMiddlewares: RequestHandler[] = [
    habitsMiddleware,
    habitLogsMiddleware,
    categoriesMiddleware,
    focusMiddleware,
    analyticsMiddleware,
    activityMiddleware
];

export default function appApiMiddleware(req: Request, res: Response, next: NextFunction): void {
    let index = 0;

    const run = (): void => {
        if (res.headersSent) {
            return;
        }

        if (index >= apiMiddlewares.length) {
            next();
            return;
        }

        const middleware = apiMiddlewares[index++];
        middleware(req, res, run);
    };

    run();
}
