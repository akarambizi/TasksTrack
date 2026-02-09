import { SideBarButtons } from './SideBarButtons';
import { SideBarLinks } from './SideBarLinks';
import { UserNav } from './UserNav';

export const SideBarNav = () => {
    return (
        <div className="hidden border-r bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/60 md:block">
            <div className="flex h-full max-h-screen flex-col">
                {/* Logo/Brand Section */}
                <div className="flex h-16 items-center border-b px-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <span className="text-sm font-bold">T</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-foreground">TasksTrack</span>
                            <span className="text-xs text-muted-foreground">Productivity Hub</span>
                        </div>
                    </div>
                </div>
                
                <SideBarButtons />
                <div className="flex-1 overflow-auto py-4">
                    <SideBarLinks />
                </div>
                <div className="border-t">
                    <UserNav />
                </div>
            </div>
        </div>
    );
};
