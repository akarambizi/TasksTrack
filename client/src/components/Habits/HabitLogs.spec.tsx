import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { HabitLogs } from './HabitLogs';
import { useHabitLogs } from '../../queries/habitLogs';
import { AxiosError } from 'axios';
import {
  mockHabit,
  mockHabitLogs,
  createMockQuery,
  renderWithProviders
} from '../../utils/test-utils';

// Mock the queries
vi.mock('../../queries/habitLogs', () => ({
    useHabitLogs: vi.fn(),
}));




describe('HabitLogs', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('shows loading state', () => {
        vi.mocked(useHabitLogs).mockReturnValue(createMockQuery(undefined, { isLoading: true }));

        renderWithProviders(<HabitLogs habit={mockHabit} />);

        expect(screen.getByTestId('habit-logs-loading')).toBeInTheDocument();
        expect(screen.getByText('Recent Activity')).toBeInTheDocument();

        // Should show loading skeletons
        const skeletons = screen.getByTestId('habit-logs-loading').querySelectorAll('.animate-pulse');
        expect(skeletons.length).toBeGreaterThan(0);
    });

    it('shows error state', () => {
        const axiosError = { isAxiosError: true, toJSON: () => ({}) } as AxiosError;
        vi.mocked(useHabitLogs).mockReturnValue(createMockQuery(undefined, { isError: true, error: axiosError }));

        renderWithProviders(<HabitLogs habit={mockHabit} />);

        expect(screen.getByTestId('habit-logs-error')).toBeInTheDocument();
        expect(screen.getByText('Failed to load activity logs')).toBeInTheDocument();
    });

    it('shows empty state when no logs exist', () => {

        vi.mocked(useHabitLogs).mockReturnValue(createMockQuery([]));



        renderWithProviders(
            <HabitLogs habit={mockHabit} />,
        );

        expect(screen.getByTestId('habit-logs-empty')).toBeInTheDocument();
        expect(screen.getByText('No activity logged yet')).toBeInTheDocument();
        expect(screen.getByText(/Start logging your progress/)).toBeInTheDocument();
    });

    it('displays habit logs correctly', () => {

        vi.mocked(useHabitLogs).mockReturnValue(createMockQuery(mockHabitLogs));



        renderWithProviders(
            <HabitLogs habit={mockHabit} />,
        );

        expect(screen.getByTestId('habit-logs-container')).toBeInTheDocument();
        expect(screen.getByText('Recent Activity')).toBeInTheDocument();

        // Check each log is rendered
        mockHabitLogs.forEach((log) => {
            expect(screen.getByTestId(`habit-log-${log.id}`)).toBeInTheDocument();
            expect(screen.getByTestId(`log-value-${log.id}`)).toHaveTextContent(`${log.value} reps`);
        });
    });

    it('shows today badge for today\'s logs', () => {
        const today = new Date();
        const todayLog = {
            ...mockHabitLogs[0],
            date: today.toISOString(), // Use full ISO string to avoid timezone issues
        };


        vi.mocked(useHabitLogs).mockReturnValue(createMockQuery([todayLog]));



        renderWithProviders(
            <HabitLogs habit={mockHabit} />,
        );

        expect(screen.getByTestId(`today-badge-${todayLog.id}`)).toBeInTheDocument();
        expect(screen.getByText('Today')).toBeInTheDocument();
    });

    it('shows target achievement status', () => {

        vi.mocked(useHabitLogs).mockReturnValue(createMockQuery(mockHabitLogs));



        renderWithProviders(
            <HabitLogs habit={mockHabit} />,
        );

        // First log (35 reps) should show target met (target is 10)
        expect(screen.getByTestId(`target-badge-${mockHabitLogs[0].id}`)).toHaveTextContent('✓ Target Met');

        // Second log (25 reps) should show target met (target is 10)
        expect(screen.getByTestId(`target-badge-${mockHabitLogs[1].id}`)).toHaveTextContent('✓ Target Met');
    });

    it('displays notes when present', () => {

        vi.mocked(useHabitLogs).mockReturnValue(createMockQuery(mockHabitLogs));



        renderWithProviders(
            <HabitLogs habit={mockHabit} />,
        );

        // First log has notes
        expect(screen.getByTestId(`log-notes-${mockHabitLogs[0].id}`)).toBeInTheDocument();
        expect(screen.getByText('Great workout today!')).toBeInTheDocument();

        // Second log has notes
        expect(screen.getByTestId(`log-notes-${mockHabitLogs[1].id}`)).toBeInTheDocument();
        expect(screen.getByText('Good progress')).toBeInTheDocument();
    });

    it('handles habit without target', () => {
        const habitWithoutTarget = {
            ...mockHabit,
            target: null,
        };

        vi.mocked(useHabitLogs).mockReturnValue(createMockQuery([mockHabitLogs[0]]));



        renderWithProviders(
            <HabitLogs habit={habitWithoutTarget} />,
        );

        // Should not show target badge when habit has no target
        expect(screen.queryByTestId(`target-badge-${mockHabitLogs[0].id}`)).not.toBeInTheDocument();
    });

    it('handles habit without unit', () => {
        const habitWithoutUnit = {
            ...mockHabit,
            unit: null,
        };

        vi.mocked(useHabitLogs).mockReturnValue(createMockQuery([mockHabitLogs[0]]));



        renderWithProviders(
            <HabitLogs habit={habitWithoutUnit} />,
        );

        // Should fallback to metricType or 'units'
        expect(screen.getByTestId(`log-value-${mockHabitLogs[0].id}`)).toHaveTextContent('35 count');
    });

    it('respects limit prop', () => {


        renderWithProviders(
            <HabitLogs habit={mockHabit} limit={5} />,
        );

        expect(useHabitLogs).toHaveBeenCalledWith({
            habitId: mockHabit.id,
            limit: 5,
        });
    });

    it('uses default limit when not specified', () => {


        renderWithProviders(
            <HabitLogs habit={mockHabit} />,
        );

        expect(useHabitLogs).toHaveBeenCalledWith({
            habitId: mockHabit.id,
            limit: 10,
        });
    });
});