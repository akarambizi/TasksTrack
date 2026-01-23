// PomodoroDialog.tsx
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Clock } from 'lucide-react';
import { IHabit } from '@/api';
import { Pomodoro } from '@/components/Pomodoro/Pomodoro';

interface PomodoroDialogProps {
  habit: IHabit;
}

export const PomodoroDialog = ({ habit }: PomodoroDialogProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
          <Clock size={16} className="text-blue-500 dark:text-blue-400" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle>Focus on habit: {habit.name}</DialogTitle>
        </DialogHeader>

        <Pomodoro habit={habit} />

        <DialogFooter className="px-6 pb-6">
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
