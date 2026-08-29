import { Home, PieChart, Target, Sheet } from 'lucide-react';
import { NavItem } from './NavItem';
import { Badge } from '../ui/badge';

export const SideBarLinks = () => {
    return (
        <nav className="space-y-3 px-2">
            {/* Overview Section */}
            <div className="mb-6">
                <div className="px-4 pb-1">
                    <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.14em]">
                        Overview
                    </h3>
                </div>
                <NavItem to="/dashboard" icon={<Home size={20} />}>
                    Dashboard
                </NavItem>
            </div>

            {/* Productivity Section */}
            <div className="mb-6">
                <div className="px-4 pb-1">
                    <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.14em]">
                        Productivity
                    </h3>
                </div>
                <NavItem to="/productivity" icon={<Target size={20} />}>
                    <div className="flex items-center justify-between flex-1">
                        <span>Productivity Hub</span>
                        <Badge variant="secondary" className="text-xs px-2 py-0.5">3</Badge>
                    </div>
                </NavItem>
            </div>

            {/* Analytics Section */}
            <div>
                <div className="px-4 pb-1">
                    <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.14em]">
                        Analytics
                    </h3>
                </div>
                <NavItem to="/analytics" icon={<PieChart size={20} />}>
                    Analytics Hub
                </NavItem>
                <NavItem to="/sync" icon={<Sheet size={20} />}>
                    Sheets Sync
                </NavItem>
            </div>
        </nav>
    );
};
