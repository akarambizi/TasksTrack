import { Calendar, Clock, Home, List, PieChart } from 'lucide-react';
import { NavItem } from './NavItem';
import { Badge } from '../ui/badge';

export const SideBarLinks = () => {
    return (
        <>
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                <NavItem to="/dashboard" icon={<Home size={18} />}>
                    Dashboard
                </NavItem>
                <NavItem to="/tasks" icon={<List size={18} />}>
                    Tasks
                    <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">6</Badge>
                </NavItem>
                <NavItem to="/pomodoro" icon={<Clock size={18} />}>
                    Pomodoro
                </NavItem>
                <NavItem to="/history" icon={<Calendar size={18} />}>
                    History
                </NavItem>
                <NavItem to="/statistics" icon={<PieChart size={18} />}>
                    Statistics
                </NavItem>
            </nav>
        </>
    );
};
