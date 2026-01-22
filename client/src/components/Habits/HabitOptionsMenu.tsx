import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, Archive, Play, Trash2, Edit, Plus } from "lucide-react";
import { IHabit, deleteHabit, archiveHabit, activateHabit } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface HabitOptionsMenuProps {
  habit: IHabit;
  onEdit?: (habit: IHabit) => void;
  onLogActivity?: (habit: IHabit) => void;
}

export const HabitOptionsMenu = ({ habit, onEdit, onLogActivity }: HabitOptionsMenuProps) => {
  const queryClient = useQueryClient();

  const deleteHabitMutation = useMutation({
    mutationFn: deleteHabit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    },
  });

  const archiveHabitMutation = useMutation({
    mutationFn: archiveHabit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    },
  });

  const activateHabitMutation = useMutation({
    mutationFn: activateHabit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    },
  });

  // Determine if any mutation is in progress to disable UI
  const isLoading = deleteHabitMutation.isPending || archiveHabitMutation.isPending || activateHabitMutation.isPending;

  // Handler for logging activity
  const handleLogActivity = () => {
    if (onLogActivity) {
      onLogActivity(habit);
    }
  };

  // Handler for editing habit
  const handleEditHabit = () => {
    if (onEdit) {
      onEdit(habit);
    }
  };

  // Handler for deleting a habit
  const handleDeleteHabit = () => {
    deleteHabitMutation.mutate(habit.id);
  };

  // Handler for archiving/activating habit
  const handleToggleActive = () => {
    if (habit.isActive) {
      archiveHabitMutation.mutate(habit.id);
    } else {
      activateHabitMutation.mutate(habit.id);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
          <Settings size={16} className="text-slate-500 dark:text-slate-400" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleLogActivity} disabled={isLoading || !habit.isActive}>
          <Plus className="mr-2 h-4 w-4" />
          Log Activity
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleEditHabit} disabled={isLoading}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Habit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleToggleActive}
          className={habit.isActive ? "text-orange-600 dark:text-orange-400" : "text-green-600 dark:text-green-400"}
          disabled={isLoading}
        >
          {habit.isActive ? (
            <>
              <Archive className="mr-2 h-4 w-4" />
              Archive Habit
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Activate Habit
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDeleteHabit} className="text-red-600 dark:text-red-400" disabled={isLoading}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Habit
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
