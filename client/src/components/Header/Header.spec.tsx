import type { MouseEventHandler, PropsWithChildren } from 'react';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { screen, cleanup, fireEvent } from '@testing-library/react';
import { UserMenu } from './UserMenu';
import { ThemeToggle } from './ThemeToggle';
import { Header } from './Header';
import { renderWithProviders } from '../../utils/test-utils';

type MockChildrenProps = PropsWithChildren;
type MockTriggerProps = PropsWithChildren<{ asChild?: boolean }>;
type MockButtonProps = PropsWithChildren<{ onClick?: MouseEventHandler<HTMLButtonElement> }>;

// Mock dropdown-menu to render inline (avoid portal issues in happy-dom)
vi.mock('@/components/ui/dropdown-menu', () => ({
    DropdownMenu: ({ children }: MockChildrenProps) => <div>{children}</div>,
    DropdownMenuTrigger: ({ children, asChild = false }: MockTriggerProps) => (asChild ? children : <div>{children}</div>),
    DropdownMenuContent: ({ children }: MockChildrenProps) => <div data-testid="dropdown-content">{children}</div>,
    DropdownMenuLabel: ({ children }: MockChildrenProps) => <div>{children}</div>,
    DropdownMenuSeparator: () => <hr />,
    DropdownMenuItem: ({ children, onClick, ...props }: MockButtonProps) => (
        <button onClick={onClick} {...props}>{children}</button>
    ),
    DropdownMenuGroup: ({ children }: MockChildrenProps) => <div>{children}</div>,
    DropdownMenuSub: ({ children }: MockChildrenProps) => <div>{children}</div>,
    DropdownMenuSubTrigger: ({ children }: MockChildrenProps) => <div>{children}</div>,
    DropdownMenuSubContent: ({ children }: MockChildrenProps) => <div>{children}</div>,
    DropdownMenuRadioGroup: ({ children }: MockChildrenProps) => <div>{children}</div>,
    DropdownMenuRadioItem: ({ children, onClick }: MockButtonProps) => <button onClick={onClick}>{children}</button>,
    DropdownMenuCheckboxItem: ({ children }: MockChildrenProps) => <div>{children}</div>,
    DropdownMenuShortcut: ({ children }: MockChildrenProps) => <span>{children}</span>,
}));

const mockLogoutMutate = vi.fn();
vi.mock('@/queries', () => ({
    useLogout: vi.fn(() => ({ mutate: mockLogoutMutate, isPending: false })),
}));

const mockSetTheme = vi.fn();
vi.mock('@/context/ThemeProvider', () => ({
    useTheme: vi.fn(() => ({ setTheme: mockSetTheme, theme: 'light' })),
}));

import * as queriesModule from '@/queries';
import * as themeModule from '@/context/ThemeProvider';

const mockUseLogout = queriesModule.useLogout as ReturnType<typeof vi.fn>;
const mockUseTheme = themeModule.useTheme as ReturnType<typeof vi.fn>;

describe('UserMenu', () => {
    afterEach(() => cleanup());

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseLogout.mockReturnValue({ mutate: mockLogoutMutate, isPending: false });
        mockUseTheme.mockReturnValue({ setTheme: mockSetTheme, theme: 'light' });
    });

    it('renders user menu trigger button', () => {
        renderWithProviders(<UserMenu />);
        expect(screen.getByTestId('user-menu')).toBeInTheDocument();
    });

    it('shows My Account label', () => {
        renderWithProviders(<UserMenu />);
        expect(screen.getByText('My Account')).toBeInTheDocument();
    });

    it('shows logout option', () => {
        renderWithProviders(<UserMenu />);
        expect(screen.getByTestId('logout-button')).toBeInTheDocument();
    });

    it('calls logout when logout item is clicked', () => {
        renderWithProviders(<UserMenu />);
        fireEvent.click(screen.getByTestId('logout-button'));
        expect(mockLogoutMutate).toHaveBeenCalled();
    });

});

describe('ThemeToggle', () => {
    afterEach(() => cleanup());

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseTheme.mockReturnValue({ setTheme: mockSetTheme, theme: 'light' });
    });

    it('renders theme toggle button', () => {
        renderWithProviders(<ThemeToggle />);
        // The trigger button + 3 menu item buttons (Light/Dark/System) all render inline
        expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
    });

    it('shows Light, Dark and System options', () => {
        renderWithProviders(<ThemeToggle />);
        expect(screen.getByText('Light')).toBeInTheDocument();
        expect(screen.getByText('Dark')).toBeInTheDocument();
        expect(screen.getByText('System')).toBeInTheDocument();
    });

    it('calls setTheme with light when Light is clicked', () => {
        renderWithProviders(<ThemeToggle />);
        fireEvent.click(screen.getByText('Light'));
        expect(mockSetTheme).toHaveBeenCalledWith('light');
    });

    it('calls setTheme with dark when Dark is clicked', () => {
        renderWithProviders(<ThemeToggle />);
        fireEvent.click(screen.getByText('Dark'));
        expect(mockSetTheme).toHaveBeenCalledWith('dark');
    });

    it('calls setTheme with system when System is clicked', () => {
        renderWithProviders(<ThemeToggle />);
        fireEvent.click(screen.getByText('System'));
        expect(mockSetTheme).toHaveBeenCalledWith('system');
    });
});

describe('Header', () => {
    afterEach(() => cleanup());

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseLogout.mockReturnValue({ mutate: vi.fn(), isPending: false });
        mockUseTheme.mockReturnValue({ setTheme: vi.fn(), theme: 'light' });
    });

    it('renders header element', () => {
        renderWithProviders(<Header />);
        expect(document.querySelector('header')).not.toBeNull();
    });

    it('contains user menu', () => {
        renderWithProviders(<Header />);
        expect(screen.getByTestId('user-menu')).toBeInTheDocument();
    });
});
