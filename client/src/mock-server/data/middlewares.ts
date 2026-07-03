import authMiddleware from './auth/auth.middleware.ts';
import appApiMiddleware from './app-api.middleware.ts';

export const customMiddlewares = [authMiddleware, appApiMiddleware];
