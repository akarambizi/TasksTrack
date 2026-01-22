import { HabitsCardList } from '../Habits/HabitsCardList';
import { Tasks } from '../Tasks/Tasks';

export const TasksContainer = () => {
    return (
        <>
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">Tasks</h1>
            </div>
            <HabitsCardList />
            <Tasks />
        </>
    );
};
