import { TasksTable } from './TasksTable';
import { TasksEmpty } from './TasksEmpty';

export const Tasks = () => {
    return (
        <section>
            <TasksTable />
            <TasksEmpty />
        </section>
    );
};
