import { useState } from 'react';
import { useHabitData } from '@/queries';
import { CheckCircle, Clock, Plus, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AddHabitDialog } from './AddHabitDialog';
import { EditHabitDialog } from './EditHabitDialog';
import { ConfirmDeleteDialog } from './ConfirmDeleteDialog';
import AddHabitLogDialog from './AddHabitLogDialog';
import { HabitOptionsMenu } from './HabitOptionsMenu';
import { FocusSessionDialog } from '../FocusSession';
import { CategoryManagementDialog } from '../Categories/CategoryManagementDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { IHabit } from '@/types';

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

    const activeHabits = habits?.filter(habit => habit.isActive) || [];
    const inactiveHabits = habits?.filter(habit => !habit.isActive) || [];

    return (
        <section data-testid="habit-list" className="space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Your Habits</h1>
                    <p className="text-muted-foreground">
                        Build consistency, track progress, and achieve your goals
                    </p>
                </div>
                <div className="flex gap-3">
                    <CategoryManagementDialog />
                    <AddHabitDialog />
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Active Habits</p>
                                <p className="text-2xl font-bold">{activeHabits.length}</p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-success" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Today's Progress</p>
                                <p className="text-2xl font-bold">75%</p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-primary" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Weekly Streak</p>
                                <p className="text-2xl font-bold">5 days</p>
                            </div>
                            <Clock className="h-8 w-8 text-warning" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Active Habits */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Active Habits</h2>
                    <Badge variant="secondary">{activeHabits.length} habits</Badge>
                </div>
                
                {activeHabits.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <div className="text-center space-y-4">
                                <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                                    <Plus className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium">No active habits yet</h3>
                                    <p className="text-muted-foreground">
                                        Start your journey by creating your first habit
                                    </p>
                                </div>
                                <AddHabitDialog />
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {activeHabits.map((habit) => (
                            <Card key={habit.id} data-testid="habit-card" className="group hover:shadow-md transition-all">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div 
                                            className="w-1 h-8 rounded-full"
                                            style={{ backgroundColor: habit.color || '#3b82f6' }}
                                        />
                                        <HabitOptionsMenu
                                            habit={habit}
                                            onLogActivity={handleLogActivity}
                                            onEdit={handleEditHabit}
                                            onDelete={handleDeleteHabit}
                                        />
                                    </div>
                                    <div>
                                        <Link to={`/habits/${habit.id}`}>
                                            <CardTitle className="text-lg hover:text-primary transition-colors">
                                                {habit.name}
                                            </CardTitle>
                                        </Link>
                                        <CardDescription className="mt-1">
                                            Target: {habit.target} {habit.unit} {habit.targetFrequency}
                                        </CardDescription>
                                    </div>
                                    {habit.category && (
                                        <Badge variant="outline" className="w-fit text-xs">
                                            {habit.category}
                                        </Badge>
                                    )}
                                </CardHeader>
                                
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Today's Progress</span>
                                            <span className="font-medium">3/{habit.target}</span>
                                        </div>
                                        <Progress value={75} className="h-2" />
                                    </div>
                                    
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="flex-1 gap-2"
                                            onClick={() => handleLogActivity(habit)}
                                        >
                                            <CheckCircle size={16} />
                                            Log
                                        </Button>
                                        <FocusSessionDialog
                                            habit={habit}
                                            trigger={
                                                <Button size="sm" variant="outline" className="gap-2">
                                                    <Clock size={16} />
                                                    Focus
                                                </Button>
                                            }
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Inactive Habits */}
            {inactiveHabits.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-muted-foreground">Inactive Habits</h2>
                        <Badge variant="outline">{inactiveHabits.length} habits</Badge>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {inactiveHabits.map((habit) => (
                            <Card key={habit.id} className="opacity-60 hover:opacity-80 transition-opacity">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div 
                                            className="w-1 h-8 rounded-full opacity-50"
                                            style={{ backgroundColor: habit.color || '#3b82f6' }}
                                        />
                                        <HabitOptionsMenu
                                            habit={habit}
                                            onLogActivity={handleLogActivity}
                                            onEdit={handleEditHabit}
                                            onDelete={handleDeleteHabit}
                                        />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg line-through text-muted-foreground">
                                            {habit.name}
                                        </CardTitle>
                                        <CardDescription className="mt-1">
                                            Target: {habit.target} {habit.unit} {habit.targetFrequency}
                                        </CardDescription>
                                    </div>
                                    {habit.category && (
                                        <Badge variant="outline" className="w-fit text-xs opacity-50">
                                            {habit.category}
                                        </Badge>
                                    )}
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* Dialogs */}
            {selectedHabitForLogging && (
                <AddHabitLogDialog
                    habit={selectedHabitForLogging}
                    isOpen={true}
                    onClose={() => handleCloseLogDialog(false)}
                />
            )}

            <EditHabitDialog
                habit={selectedHabitForEditing}
                open={isEditDialogOpen}
                onOpenChange={handleCloseEditDialog}
            />

            <ConfirmDeleteDialog
                habit={selectedHabitForDeleting}
                open={isDeleteDialogOpen}
                onOpenChange={handleCloseDeleteDialog}
            />
        </section>
    );
};
