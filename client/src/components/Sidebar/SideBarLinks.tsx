import { Calendar, Clock, Home, PieChart, Target } from 'lucide-react';
import { NavItem } from './NavItem';
import { Badge } from '../ui/badge';

export const SideBarLinks = () => {
    return (
        <nav className="space-y-2">
            {/* Overview Section */}
            <div className="mb-6">
                <div className="px-4 pb-2">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Overview
                    </h3>
                </div>
                <NavItem to="/dashboard" icon={<Home size={20} />}>
                    Dashboard
                </NavItem>
            </div>

            {/* Productivity Section */}
            <div className="mb-6">
                <div className="px-4 pb-2">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Productivity
                    </h3>
                </div>
                <NavItem to="/habits" icon={<Target size={20} />}>
                    <div className="flex items-center justify-between flex-1">
                        <span>Habits</span>
                        <Badge variant="secondary" className="text-xs px-2 py-0.5">6</Badge>
                    </div>
                </NavItem>
                <NavItem to="/focus-sessions" icon={<Clock size={20} />}>
                    Focus Sessions
                </NavItem>
            </div>

            {/* Analytics Section */}
            <div>
                <div className="px-4 pb-2">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Analytics
                    </h3>
                </div>
                <NavItem to="/history" icon={<Calendar size={20} />}>
                    History
                </NavItem>
                <NavItem to="/statistics" icon={<PieChart size={20} />}>
                    Statistics
                </NavItem>
            </div>
        </nav>
    );
};
