import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, CheckSquare, Trash2, Edit, AlertCircle } from "lucide-react";
import { IToDoTask } from "@/api";
import { useQueryClient } from "react-query";
import { getTodoTaskKey } from "@/hooks/queryKeys";

interface TaskOptionsMenuProps {
  task: IToDoTask;
}

export const TaskOptionsMenu = ({ task }: TaskOptionsMenuProps) => {
  const queryClient = useQueryClient();

  const toggleTaskCompletion = () => {
    // Optimistically update the UI
    queryClient.setQueryData<IToDoTask[] | undefined>(getTodoTaskKey(''), (oldData) => {
      if (!oldData) return oldData;
      return oldData.map(t =>
        t.id === task.id
          ? { ...t, completed: !t.completed }
          : t
      );
    });

    // TODO: add api call to update the task completion status
    // await updateTaskCompletion(task.id, !task.completed);

    // Refetch to ensure consistency with server
    // queryClient.invalidateQueries(getTodoTaskKey(''));
  };

  const deleteTask = () => {
    // Optimistically update the UI
    queryClient.setQueryData<IToDoTask[] | undefined>(getTodoTaskKey(''), (oldData) => {
      if (!oldData) return oldData;
      return oldData.filter(t => t.id !== task.id);
    });

    // TODO: add api call to delete the task
    // await deleteTaskById(task.id);
  };

  const changePriority = (priority: 'low' | 'medium' | 'high') => {
    // Optimistically update the UI
    queryClient.setQueryData<IToDoTask[] | undefined>(getTodoTaskKey(''), (oldData) => {
      if (!oldData) return oldData;
      return oldData.map(t =>
        t.id === task.id
          ? { ...t, priority }
          : t
      );
    });

    // TODO: add api call to update the task priority
    // await updateTaskPriority(task.id, priority);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
          <Settings size={16} className="text-slate-500 dark:text-slate-400" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={toggleTaskCompletion}>
          <CheckSquare className="mr-2 h-4 w-4" />
          {task.completed ? 'Mark as Todo' : 'Mark as Complete'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => {}}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Task
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => changePriority('low')} className="text-blue-600 dark:text-blue-400">
          <AlertCircle className="mr-2 h-4 w-4" />
          Set Low Priority
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changePriority('medium')} className="text-yellow-600 dark:text-yellow-400">
          <AlertCircle className="mr-2 h-4 w-4" />
          Set Medium Priority
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changePriority('high')} className="text-red-600 dark:text-red-400">
          <AlertCircle className="mr-2 h-4 w-4" />
          Set High Priority
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={deleteTask} className="text-red-600 dark:text-red-400">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Task
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
