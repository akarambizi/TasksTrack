import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, CheckSquare, Trash2, Edit, AlertCircle } from "lucide-react";
import { IToDoTask } from "@/api";
import { useToggleTaskCompletion, useDeleteTask, useUpdateTaskPriority } from "@/queries";

interface TaskOptionsMenuProps {
  task: IToDoTask;
}

export const TaskOptionsMenu = ({ task }: TaskOptionsMenuProps) => {
  const toggleCompletion = useToggleTaskCompletion();
  const deleteTaskMutation = useDeleteTask();
  const updatePriority = useUpdateTaskPriority();

  // Determine if any mutation is in progress to disable UI
  const isLoading = toggleCompletion.isPending || deleteTaskMutation.isPending || updatePriority.isPending;

  // Handler for toggling task completion
  const handleToggleCompletion = () => {
    toggleCompletion.mutate({
      id: task.id,
      completed: !task.completed
    });
  };

  // Handler for deleting a task
  const handleDeleteTask = () => {
    deleteTaskMutation.mutate(task.id);
  };

  // Handler for changing task priority
  const handleChangePriority = (priority: 'low' | 'medium' | 'high') => {
    if (task.priority === priority) return; // No change needed

    updatePriority.mutate({
      id: task.id,
      priority
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
          <Settings size={16} className="text-slate-500 dark:text-slate-400" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleToggleCompletion} disabled={isLoading}>
          <CheckSquare className="mr-2 h-4 w-4" />
          {task.completed ? 'Mark as Todo' : 'Mark as Complete'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => {}} disabled={isLoading}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Task
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => handleChangePriority('low')}
          className="text-blue-600 dark:text-blue-400"
          disabled={isLoading || task.priority === 'low'}
        >
          <AlertCircle className="mr-2 h-4 w-4" />
          Set Low Priority
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleChangePriority('medium')}
          className="text-yellow-600 dark:text-yellow-400"
          disabled={isLoading || task.priority === 'medium'}
        >
          <AlertCircle className="mr-2 h-4 w-4" />
          Set Medium Priority
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleChangePriority('high')}
          className="text-red-600 dark:text-red-400"
          disabled={isLoading || task.priority === 'high'}
        >
          <AlertCircle className="mr-2 h-4 w-4" />
          Set High Priority
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDeleteTask} className="text-red-600 dark:text-red-400" disabled={isLoading}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Task
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
