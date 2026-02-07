import { useState } from 'react';
import { useHabitData } from '@/queries';
import { CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AddHabitDialog } from './AddHabitDialog';
import { EditHabitDialog } from './EditHabitDialog';
import { ConfirmDeleteDialog } from './ConfirmDeleteDialog';
import AddHabitLogDialog from './AddHabitLogDialog';
import { HabitOptionsMenu } from './HabitOptionsMenu';
import { FocusSessionDialog } from '../FocusSession';
import { CategoryManagementDialog } from '../Categories/CategoryManagementDialog';
import { IHabit } from '@/api';

export const Habits = () => {
    const { data: habits } = useHabitData('');
    const [selectedHabitForLogging, setSelectedHabitForLogging] = useState<IHabit | null>(null);
    const [selectedHabitForEditing, setSelectedHabitForEditing] = useState<IHabit | null>(null);
    const [selectedHabitForDeleting, setSelectedHabitForDeleting] = useState<IHabit | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const handleLogActivity = (habit: IHabit) => {
        setSelectedHabitForLogging(habit);
    };

    const handleEditHabit = (habit: IHabit) => {
        setSelectedHabitForEditing(habit);
        setIsEditDialogOpen(true);
    };

    const handleDeleteHabit = (habit: IHabit) => {
        setSelectedHabitForDeleting(habit);
        setIsDeleteDialogOpen(true);
    };

    const handleCloseLogDialog = (open: boolean) => {
        if (!open) {
            setSelectedHabitForLogging(null);
        }
    };

    const handleCloseEditDialog = (open: boolean) => {
        setIsEditDialogOpen(open);
        if (!open) {
            setSelectedHabitForEditing(null);
        }
    };

    const handleCloseDeleteDialog = (open: boolean) => {
        setIsDeleteDialogOpen(open);
        if (!open) {
            setSelectedHabitForDeleting(null);
        }
    };

    return (
        <section>
            <div className="flex-1 overflow-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Your Habits</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Build and track your daily habits</p>
                    </div>
                    <div className="flex gap-2">
                        <CategoryManagementDialog />
                        <AddHabitDialog />
                    </div>
                </div>

                <div className="grid gap-4">
                    {habits?.map((habit) => (
                        <div
                            key={habit.id}
                            className={`p-4 rounded-lg border ${!habit.isActive ? 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-60' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'}`}
                            style={{
                                borderLeftColor: habit.color || '#3b82f6',
                                borderLeftWidth: '4px'
                            }}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3">
                                    <div className={`mt-1 h-5 w-5 rounded-full flex items-center justify-center ${habit.isActive ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400' : 'border-2 border-slate-300 dark:border-slate-600'}`}>
                                        {habit.isActive && <CheckCircle size={14} />}
                                    </div>
                                    <div>
                                        <Link
                                            to={`/habits/${habit.id}`}
                                            className="hover:underline"
                                        >
                                            <h4 className={`font-medium ${!habit.isActive ? 'text-slate-500 dark:text-slate-400 line-through' : 'text-slate-800 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400'}`}>
                                                {habit.name}
                                            </h4>
                                        </Link>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                            Target: {habit.target} {habit.unit} {habit.targetFrequency}
                                        </p>
                                        {habit.category && (
                                            <span className="inline-block px-2 py-1 text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full mt-1">
                                                {habit.category}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <AddHabitLogDialog
                                        habit={habit}
                                        isOpen={false}
                                        onClose={() => {}}
                                    />
                                    <FocusSessionDialog
                                        habit={habit}
                                        trigger={
                                            <button className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
                                                <Clock size={16} className="text-blue-500 dark:text-blue-400" />
                                            </button>
                                        }
                                    />
                                    <HabitOptionsMenu
                                        habit={habit}
                                        onLogActivity={handleLogActivity}
                                        onEdit={handleEditHabit}
                                        onDelete={handleDeleteHabit}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Log Activity Dialog triggered from options menu */}
                {selectedHabitForLogging && (
                    <AddHabitLogDialog
                        habit={selectedHabitForLogging}
                        isOpen={true}
                        onClose={() => handleCloseLogDialog(false)}
                    />
                )}

                {/* Edit Habit Dialog */}
                <EditHabitDialog
                    habit={selectedHabitForEditing}
                    open={isEditDialogOpen}
                    onOpenChange={handleCloseEditDialog}
                />

                {/* Delete Confirmation Dialog */}
                <ConfirmDeleteDialog
                    habit={selectedHabitForDeleting}
                    open={isDeleteDialogOpen}
                    onOpenChange={handleCloseDeleteDialog}
                />
            </div>
        </section>
    );
};
