import { Package2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SideBarButtons = () => {
    return (
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link to="/dashboard" className="flex items-center gap-2 font-semibold">
                <Package2 className="h-6 w-6" />
                <span className="">Task Tracker</span>
            </Link>
        </div>
    );
};
