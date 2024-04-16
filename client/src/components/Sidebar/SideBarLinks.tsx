import { Home, LineChart, Package } from 'lucide-react';
import { Upgrade } from './Upgrade';
import { NavItem } from './NavItem';

export const SideBarLinks = () => {
    return (
        <>
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                <NavItem to="/dashboard" icon={<Home className="h-4 w-4" />}>
                    Dashboard
                </NavItem>
                <NavItem to="/tasks" icon={<Package className="h-4 w-4" />}>
                    Tasks
                </NavItem>
                <NavItem to="/analytics" icon={<LineChart className="h-4 w-4" />}>
                    Analytics
                </NavItem>
            </nav>
            <Upgrade />
        </>
    );
};
