import { useTodoTaskData } from '@/hooks/useQueryHooks';
import { CheckCircle, Clock, Plus, Settings } from 'lucide-react';

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
                        <h3 className="text-xl font-bold text-slate-800">Your Tasks</h3>
                        <p className="text-sm text-slate-500">Manage and track your tasks</p>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
                        <Plus size={16} className="mr-2" />
                        Add Task
                    </button>
                </div>

                <div className="grid gap-4">
                    {tasks?.map((task) => (
                        <div
                            key={task.id}
                            className={`p-4 rounded-lg border ${task.completed ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-200'} ${
                                task.priority === 'high' ? 'border-l-4 border-l-red-500' : task.priority === 'medium' ? 'border-l-4 border-l-yellow-500' : 'border-l-4 border-l-blue-500'
                            }`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3">
                                    <div className={`mt-1 h-5 w-5 rounded-full flex items-center justify-center ${task.completed ? 'bg-green-100 text-green-600' : 'border-2 border-slate-300'}`}>
                                        {task.completed && <CheckCircle size={14} />}
                                    </div>
                                    <div>
                                        <h4 className={`font-medium ${task.completed ? 'text-slate-500 line-through' : 'text-slate-800'}`}>{task.title}</h4>
                                        <p className="text-xs text-slate-500 mt-1">Priority: {task.priority}</p>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button className="p-1 rounded hover:bg-slate-100">
                                        <Clock size={16} className="text-blue-500" />
                                    </button>
                                    <button className="p-1 rounded hover:bg-slate-100">
                                        <Settings size={16} className="text-slate-500" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
