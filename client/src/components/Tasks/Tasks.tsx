import { useTodoTaskData } from '@/hooks/useQueryHooks';
import { CheckCircle } from 'lucide-react';
import { AddTaskDialog } from './AddTaskDialog';
import { TaskOptionsMenu } from './TaskOptionsMenu';
import { PomodoroDialog } from '../Pomodoro/PomodoroDialog';

export const Tasks = () => {
    const { data: tasks } = useTodoTaskData('');
    console.log('data', tasks);
    return (
        <section>
            {/* <TasksTable />
            <TasksEmpty /> */}

            <div className="flex-1 overflow-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Your Tasks</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Manage and track your tasks</p>
                    </div>
                    <AddTaskDialog />
                </div>

                <div className="grid gap-4">
                    {tasks?.map((task) => (
                        <div
                            key={task.id}
                            className={`p-4 rounded-lg border ${task.completed ? 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'} ${
                                task.priority === 'high' ? 'border-l-4 border-l-red-500' : task.priority === 'medium' ? 'border-l-4 border-l-yellow-500' : 'border-l-4 border-l-blue-500'
                            }`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3">
                                    <div className={`mt-1 h-5 w-5 rounded-full flex items-center justify-center ${task.completed ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400' : 'border-2 border-slate-300 dark:border-slate-600'}`}>
                                        {task.completed && <CheckCircle size={14} />}
                                    </div>
                                    <div>
                                        <h4 className={`font-medium ${task.completed ? 'text-slate-500 dark:text-slate-400 line-through' : 'text-slate-800 dark:text-slate-100'}`}>{task.title}</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Priority: {task.priority || 'Low'}</p>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <PomodoroDialog task={task} />
                                    <TaskOptionsMenu task={task} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
