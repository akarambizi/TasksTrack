import { TasksTable } from './TasksTable';
import { TasksEmpty } from './TasksEmpty';
import { useTodoTaskData } from '@/hooks/useQueryHooks';

export const Tasks = () => {
    const { data } = useTodoTaskData('');
    console.log('data', data);
    return (
        <section>
            <TasksTable />
            <TasksEmpty />
        </section>
    );
};
