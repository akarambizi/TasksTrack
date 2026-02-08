import { renderWithProviders } from '../../utils/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FocusSessionDialog } from './FocusSessionDialog';
import { IHabit } from '@/types';
import { HABIT_COLORS, TARGET_FREQUENCY } from '@/types/constants';

// Mock the FocusTimerContext
vi.mock('@/context/FocusTimerContext', () => ({
    FocusTimerProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

// Mock the FocusTimer component to control dialog rendering
vi.mock('./FocusTimer', () => ({
    FocusTimer: ({ habit }: { habit: IHabit }) => (
        <div data-testid="focus-timer">Focus Timer for {habit.name}</div>
    )
}));

describe('FocusSessionDialog', () => {
    const mockHabit = {
        id: 1,
        name: 'Reading',
        description: 'Daily reading habit',
        color: HABIT_COLORS.BLUE,
        isActive: true,
        metricType: 'binary' as const,
        createdBy: 'user1',
        createdDate: '2026-01-31T10:00:00Z',
        modifiedBy: 'user1',
        modifiedDate: '2026-01-31T10:00:00Z',
        unit: null,
        target: null,
        targetFrequency: null,
        category: null,
        updatedDate: null,
        updatedBy: null,
        icon: null
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render dialog trigger', () => {
        renderWithProviders(
            <FocusSessionDialog habit={mockHabit} />
        );

        expect(screen.getByTestId('focus-dialog-trigger')).toBeInTheDocument();
        expect(screen.getByText('Focus')).toBeInTheDocument();
    });

    it('should display habit name when provided', () => {
        renderWithProviders(

                <FocusSessionDialog habit={mockHabit} />

        );

        expect(screen.getByTestId('focus-dialog-trigger')).toBeInTheDocument();
    });

    it('should render with custom trigger', () => {
        const customTrigger = <button data-testid="custom-trigger">Custom Start</button>;

        renderWithProviders(

                <FocusSessionDialog habit={mockHabit} trigger={customTrigger} />

        );

        expect(screen.getByTestId('custom-trigger')).toBeInTheDocument();
        expect(screen.getByText('Custom Start')).toBeInTheDocument();
    });

    it('should handle habit with different properties', () => {
        const differentHabit = {
            ...mockHabit,
            name: 'Exercise',
            color: HABIT_COLORS.GREEN,
            description: 'Daily workout'
        };

        renderWithProviders(

                <FocusSessionDialog habit={differentHabit} />

        );

        expect(screen.getByTestId('focus-dialog-trigger')).toBeInTheDocument();
    });

    it('should render dialog components correctly', () => {
        renderWithProviders(

                <FocusSessionDialog habit={mockHabit} />

        );

        const trigger = screen.getByTestId('focus-dialog-trigger');
        expect(trigger).toBeInTheDocument();
        expect(screen.getByText('Focus')).toBeInTheDocument();
    });

    it('should open dialog when trigger is clicked', async () => {
        const user = userEvent.setup();

        renderWithProviders(

                <FocusSessionDialog habit={mockHabit} />

        );

        const trigger = screen.getByTestId('focus-dialog-trigger');
        await user.click(trigger);

        await waitFor(() => {
            expect(screen.getByTestId('focus-dialog-content')).toBeInTheDocument();
            expect(screen.getByTestId('dialog-title')).toBeInTheDocument();
            expect(screen.getByText('Focus Session')).toBeInTheDocument();
        });
    });

    it('should display habit name in the dialog', async () => {
        const user = userEvent.setup();

        renderWithProviders(

                <FocusSessionDialog habit={mockHabit} />

        );

        await user.click(screen.getByTestId('focus-dialog-trigger'));

        await waitFor(() => {
            expect(screen.getByTestId('habit-badge')).toBeInTheDocument();
            expect(screen.getByText('Reading')).toBeInTheDocument();
        });
    });

    it('should display habit target information when available', async () => {
        const habitWithTarget = {
            ...mockHabit,
            target: 30,
            unit: 'minutes',
            targetFrequency: TARGET_FREQUENCY.DAILY
        };
        const user = userEvent.setup();

        renderWithProviders(

                <FocusSessionDialog habit={habitWithTarget} />

        );

        await user.click(screen.getByTestId('focus-dialog-trigger'));

        await waitFor(() => {
            expect(screen.getByText('Target: 30 minutes daily')).toBeInTheDocument();
        });
    });

    it('should not display target information when not available', async () => {
        const user = userEvent.setup();

        renderWithProviders(

                <FocusSessionDialog habit={mockHabit} />

        );

        await user.click(screen.getByTestId('focus-dialog-trigger'));

        await waitFor(() => {
            expect(screen.queryByText(/Target:/)).not.toBeInTheDocument();
        });
    });

    it('should render FocusTimer component within dialog', async () => {
        const user = userEvent.setup();

        renderWithProviders(

                <FocusSessionDialog habit={mockHabit} />

        );

        await user.click(screen.getByTestId('focus-dialog-trigger'));

        await waitFor(() => {
            expect(screen.getByTestId('focus-timer')).toBeInTheDocument();
            expect(screen.getByText('Focus Timer for Reading')).toBeInTheDocument();
        });
    });
});