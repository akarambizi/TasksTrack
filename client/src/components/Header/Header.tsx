import { ThemeToggle } from '../Header/ThemeToggle';
import { HeaderMobile } from '../Header/HeaderMobile';
import { HeaderSearch } from '../Header/HeaderSearch';
import { UserMenu } from '../Header/UserMenu';

export const Header = () => {
    return (
        <header className="sticky top-0 z-40 mx-4 mt-4 flex h-16 items-center gap-4 rounded-2xl border border-border/70 bg-card/85 px-5 shadow-sm backdrop-blur md:mx-6 md:px-6 lg:mx-8">
            <HeaderMobile />
            <div className="flex-1">
                <HeaderSearch />
            </div>
            <div className="flex items-center gap-4">
                <ThemeToggle />
                <UserMenu />
            </div>
        </header>
    );
};
