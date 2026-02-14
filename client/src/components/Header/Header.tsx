import { ThemeToggle } from '../Header/ThemeToggle';
import { HeaderMobile } from '../Header/HeaderMobile';
import { HeaderSearch } from '../Header/HeaderSearch';
import { UserMenu } from '../Header/UserMenu';

export const Header = () => {
    return (
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 px-6">
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
