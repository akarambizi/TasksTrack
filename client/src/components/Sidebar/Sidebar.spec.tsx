import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { screen, cleanup, fireEvent } from '@testing-library/react';
import { NavItem } from './NavItem';
import { UserNav } from './UserNav';
import { renderWithProviders } from '../../utils/test-utils';

const mockLogout = vi.fn();
vi.mock('@/context', () => ({
    useAuthContext: vi.fn(() => ({
        user: { name: 'Test User', email: 'test@example.com' },
        logout: mockLogout,
    })),
}));

import * as contextModule from '@/context';
const mockUseAuthContext = contextModule.useAuthContext as ReturnType<typeof vi.fn>;

describe('NavItem', () => {
    afterEach(() => cleanup());

    it('renders link with correct text', () => {
        renderWithProviders(
            <NavItem to="/dashboard" icon={<span>icon</span>}>Dashboard</NavItem>
        );
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    it('renders as a link to the correct path', () => {
        renderWithProviders(
            <NavItem to="/habits" icon={<span>icon</span>}>Habits</NavItem>
        );
        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href', '/habits');
    });

    it('renders provided icon', () => {
        renderWithProviders(
            <NavItem to="/dashboard" icon={<span data-testid="test-icon">icon</span>}>Dashboard</NavItem>
        );
        expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });

    it('renders NavLink with expected structure', () => {
        renderWithProviders(
            <NavItem to="/analytics" icon={<span>icon</span>}>Analytics</NavItem>
        );
        expect(screen.getByRole('link')).toBeInTheDocument();
        expect(screen.getByText('Analytics')).toBeInTheDocument();
    });
});

describe('UserNav', () => {
    afterEach(() => cleanup());

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseAuthContext.mockReturnValue({
            user: { name: 'Test User', email: 'test@example.com' },
            logout: mockLogout,
        });
    });

    it('renders sidebar user menu', () => {
        renderWithProviders(<UserNav />);
        expect(screen.getByTestId('sidebar-user-menu')).toBeInTheDocument();
    });

    it('displays user name', () => {
        renderWithProviders(<UserNav />);
        expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    it('displays user email', () => {
        renderWithProviders(<UserNav />);
        expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });

    it('shows settings button', () => {
        renderWithProviders(<UserNav />);
        expect(screen.getByTestId('settings-button')).toBeInTheDocument();
    });

    it('shows logout button', () => {
        renderWithProviders(<UserNav />);
        expect(screen.getByTestId('logout-button')).toBeInTheDocument();
    });

    it('calls logout on logout button click', () => {
        renderWithProviders(<UserNav />);
        fireEvent.click(screen.getByTestId('logout-button'));
        expect(mockLogout).toHaveBeenCalled();
    });

    it('shows fallback name when user has no name', () => {
        mockUseAuthContext.mockReturnValue({
            user: { name: '', email: 'noname@example.com' },
            logout: vi.fn(),
        });
        renderWithProviders(<UserNav />);
        expect(screen.getByText('User Name')).toBeInTheDocument();
    });
});
