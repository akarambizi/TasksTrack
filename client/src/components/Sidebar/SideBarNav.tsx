import { SideBarButtons } from './SideBarButtons';
import { SideBarLinks } from './SideBarLinks';

export const SideBarNav = () => {
    return (
        <div className="hidden border-r bg-muted/40 md:block">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <SideBarButtons />
                <div className="flex-1">
                    <SideBarLinks />
                </div>
            </div>
        </div>
    );
};
