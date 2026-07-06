import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { screen, cleanup, fireEvent } from '@testing-library/react';
import { SyncCenter } from './SyncCenter';
import { renderWithProviders } from '../../utils/test-utils';

vi.mock('@/mock-server/data/analytics/growthMetrics', () => ({
    syncKpis: {
        mode: 'near-real-time',
        successRate: 97.2,
        freshnessSecondsP95: 8.6,
        queuedEvents: 2,
        failedEvents: 1,
        lastSyncedAt: '2026-07-03T09:07:20.000Z',
    },
    syncEvents: [
        { id: 'se-1', source: 'habit-log', state: 'synced', occurredAt: '2026-07-03T09:02:00.000Z' },
        { id: 'se-2', source: 'focus-session', state: 'synced', occurredAt: '2026-07-03T09:03:40.000Z' },
        { id: 'se-3', source: 'goal', state: 'queued', occurredAt: '2026-07-03T09:05:15.000Z' },
        { id: 'se-4', source: 'habit-log', state: 'failed', occurredAt: '2026-07-03T09:07:20.000Z' },
    ],
}));

describe('SyncCenter', () => {
    afterEach(() => cleanup());

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the sync center page', () => {
        renderWithProviders(<SyncCenter />);
        expect(screen.getByTestId('sync-center-page')).toBeInTheDocument();
    });

    it('renders Google Sheets Sync Center heading', () => {
        renderWithProviders(<SyncCenter />);
        expect(screen.getByText(/Google Sheets Sync Center/i)).toBeInTheDocument();
    });

    it('displays success rate', () => {
        renderWithProviders(<SyncCenter />);
        expect(screen.getAllByText(/97\.2%/).length).toBeGreaterThan(0);
    });

    it('shows retry failed events button', () => {
        renderWithProviders(<SyncCenter />);
        const retryButton = screen.getByRole('button', { name: /retry failed/i });
        expect(retryButton).toBeInTheDocument();
    });

    it('shows force resync button', () => {
        renderWithProviders(<SyncCenter />);
        const resyncButton = screen.getByRole('button', { name: /force full resync/i });
        expect(resyncButton).toBeInTheDocument();
    });

    it('handles retry failed events click', () => {
        renderWithProviders(<SyncCenter />);
        expect(screen.getByText(/Failed:\s*1/i)).toBeInTheDocument();
        const retryButton = screen.getByRole('button', { name: /retry failed/i });
        fireEvent.click(retryButton);

        expect(screen.getByText(/Failed:\s*0/i)).toBeInTheDocument();
        expect(screen.queryByText('97.2%')).not.toBeInTheDocument();
        expect(screen.getAllByText('97.6%').length).toBeGreaterThan(0);
    });

    it('handles force resync click', () => {
        renderWithProviders(<SyncCenter />);
        const resyncButton = screen.getByRole('button', { name: /force full resync/i });
        fireEvent.click(resyncButton);
        expect(screen.getAllByText(/100/).length).toBeGreaterThan(0);
    });

    it('displays sheet tab mappings', () => {
        renderWithProviders(<SyncCenter />);
        expect(screen.getByText('Habits')).toBeInTheDocument();
        expect(screen.getByText('Focus Sessions')).toBeInTheDocument();
    });

    it('renders event log entries', () => {
        renderWithProviders(<SyncCenter />);
        // source "habit-log" is rendered as "habit log" (replace('-', ' '))
        expect(screen.getAllByText('habit log').length).toBeGreaterThan(0);
    });
});
