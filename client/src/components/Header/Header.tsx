import { ThemeToggle } from '../Header/ThemeToggle';
import { HeaderMobile } from '../Header/HeaderMobile';
import { HeaderSearch } from '../Header/HeaderSearch';
import { UserMenu } from '../Header/UserMenu';

export const Header = () => {
    return (
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <HeaderMobile />
            <HeaderSearch />
            <ThemeToggle />
            <UserMenu />
        </header>
    );
};
