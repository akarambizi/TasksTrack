import { SideBarButtons } from './SideBarButtons';
import { SideBarLinks } from './SideBarLinks';
import { UserNav } from './UserNav';

export const SideBarNav = () => {
    return (
        <div className="hidden md:block fixed left-4 top-4 bottom-4 z-40 w-[272px] lg:w-[304px]">
            <div className="h-full rounded-3xl border border-border/70 bg-card/90 shadow-lg backdrop-blur">
            <div className="flex h-full max-h-screen flex-col">
                {/* Logo/Brand Section */}
                <div className="flex h-20 items-center border-b border-border/70 px-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                            <span className="text-sm font-bold tracking-tight">TT</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-base font-semibold text-foreground tt-section-title">TasksTrack</span>
                            <span className="text-xs text-muted-foreground">Executive Productivity Hub</span>
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
        </div>
    );
};
