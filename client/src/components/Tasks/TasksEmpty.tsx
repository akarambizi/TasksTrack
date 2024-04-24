import { Button } from '../ui/button';

export const TasksEmpty = () => {
    return (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
            <div className="flex flex-col items-center gap-1 text-center">
                <h3 className="text-2xl font-bold tracking-tight">You have no tasks</h3>
                <p className="text-sm text-muted-foreground">You can start selling as soon as you add a task.</p>
                <Button className="mt-4">Add Task</Button>
            </div>
        </div>
    );
};
