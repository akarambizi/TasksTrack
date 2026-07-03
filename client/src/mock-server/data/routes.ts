import auth from './auth/auth.ts';
import tasks from './tasks/tasks.ts';
import habits from './habits/habits.ts';
import habitLogs from './habit-logs/habit-logs.ts';
import categories from './categories/categories.ts';
import focusSessions from './focus/focus-sessions.ts';

export default {
    tasks,
    auth,
    habits,
    'habit-logs': habitLogs,
    categories,
    'focus-sessions': focusSessions
};