import { ModeToggle } from '@/components/ModeToggle';
import { TasksTable } from './components/TasksTable/TasksTable';

const App = () => {
    return (
        <>
            <ModeToggle />
            <TasksTable />
        </>
    );
};

export default App;
