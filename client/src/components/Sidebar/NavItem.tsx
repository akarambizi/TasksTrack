import { NavLink } from 'react-router-dom';

interface NavItemProps {
    to: string;
    children: React.ReactNode;
    icon: React.ReactNode;
}

export const NavItem = ({ to, children, icon }: NavItemProps) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            isActive
                ? 'flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary'
                : 'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary'
        }
    >
        {icon}
        {children}
    </NavLink>
);
