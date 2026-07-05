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
                ? 'flex items-center gap-3 rounded-xl bg-primary/12 px-4 py-3 mx-2 text-primary font-medium transition-all border border-primary/30 shadow-sm'
                : 'flex items-center gap-3 rounded-xl px-4 py-3 mx-2 text-muted-foreground transition-all hover:text-foreground hover:bg-muted/60'
        }
    >
        <div className="flex-shrink-0">
            {icon}
        </div>
        <span className="flex-1">{children}</span>
    </NavLink>
);
