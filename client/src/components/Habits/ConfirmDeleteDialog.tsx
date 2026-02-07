import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";
import { IHabit } from "@/api";
import { useDeleteHabitMutation } from "@/queries";

interface ConfirmDeleteDialogProps {
  habit: IHabit | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ConfirmDeleteDialog({ habit, open, onOpenChange }: ConfirmDeleteDialogProps) {
  const deleteHabitMutation = useDeleteHabitMutation();

  const handleDelete = async () => {
    if (!habit) return;
    
    try {
      await deleteHabitMutation.mutateAsync(habit.id);
      onOpenChange(false);
    } catch (error) {
      // Error handling is done by the mutation
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Delete Habit
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>"{habit?.name}"</strong>? 
            This action cannot be undone and will permanently remove the habit and all its associated logs.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={deleteHabitMutation.isPending}
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            variant="destructive" 
            onClick={handleDelete}
            disabled={deleteHabitMutation.isPending}
          >
            {deleteHabitMutation.isPending ? 'Deleting...' : 'Delete Habit'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
