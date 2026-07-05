import { screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import type { ReactNode } from 'react';
import App from './App';

vi.mock('@/components', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@/components')>();
    return {
        ...actual,
        Container: ({ children }: { children: ReactNode }) => <div data-testid="test-container">{children}</div>
    };
});

vi.mock('@/components/providers', () => ({
    QueryClientProvider: ({ children }: { children: ReactNode }) => <>{children}</>
}));

vi.mock('./context', () => ({
    AuthProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
    ProtectedRoute: ({ children }: { children: ReactNode }) => <>{children}</>,
    useAuthContext: () => ({
        user: { email: 'test@example.com', name: 'User Name' },
        logout: vi.fn(),
        isAuthenticated: true,
        isLoading: false,
        login: vi.fn()
    })
}));

describe('App routes', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders yearly retrospective route', async () => {
        window.history.pushState({}, 'Retrospective', '/retrospective');

        render(<App />);

        expect(await screen.findByRole('heading', { name: 'Yearly Retrospective' })).toBeInTheDocument();
    });
});
