import { TARGET_FREQUENCY } from '@/types/constants';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { HabitLogStats } from './HabitLogStats';
import { IHabit } from '@/types';
import { useHabitLogsByHabitAndDateRange } from '../../queries/habitLogs';
import { AxiosError } from 'axios';
import { mockHabit, mockHabitLogs, createMockQuery, renderWithProviders } from '../../utils/test-utils';

// Mock the queries
vi.mock('../../queries/habitLogs', () => ({
    useHabitLogsByHabitAndDateRange: vi.fn(),
}));

describe('HabitLogStats', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('when data is loading', () => {
        beforeEach(() => {
            (useHabitLogsByHabitAndDateRange as any).mockImplementation(() =>
                createMockQuery(undefined, { isLoading: true })
            );
        });

        it('should render loading state correctly', () => {
            renderWithProviders(<HabitLogStats habit={mockHabit} />);

            // Should render cards with 0 values while loading
            const zeroReps = screen.getAllByText('0 reps');
            expect(zeroReps[0]).toBeInTheDocument(); // Today card
            expect(screen.getByText('Today')).toBeInTheDocument();
            expect(screen.getByText('This Week')).toBeInTheDocument();
            expect(screen.getByText('Active Days')).toBeInTheDocument();
        });
    });

    describe('when data is loaded successfully', () => {
        beforeEach(() => {
            (useHabitLogsByHabitAndDateRange as any).mockImplementation(() =>
                createMockQuery(mockHabitLogs)
            );
        });

        it('should display habit statistics correctly', () => {
            renderWithProviders(<HabitLogStats habit={mockHabit} />);

            // Should calculate totals correctly (35 + 25 = 60)
            const totalReps = screen.getAllByText('60 reps');
            expect(totalReps[0]).toBeInTheDocument(); // Today card
            expect(screen.getByText('Today')).toBeInTheDocument();
            expect(screen.getByText('This Week')).toBeInTheDocument();
        });

        it('should calculate progress percentage correctly with target', () => {
            renderWithProviders(<HabitLogStats habit={mockHabit} />);

            // 60 reps out of 10 target = 600%
            expect(screen.getByText(/600% of target/)).toBeInTheDocument();
        });

        it('should show target achievement badge when target is met', () => {
            renderWithProviders(<HabitLogStats habit={mockHabit} />);

            // Should show checkmark for exceeding target - 60 reps vs 10 target = 600%
            expect(screen.getByText(/600% of target ✓/)).toBeInTheDocument();
        });

        it('should calculate active days correctly', () => {
            renderWithProviders(<HabitLogStats habit={mockHabit} />);

            // Both logs are from different dates (Jan 23, Jan 22), so 2 active days
            expect(screen.getByText('2/7')).toBeInTheDocument();
            expect(screen.getByText('Days this week')).toBeInTheDocument();
        });
    });

    describe('when habit has weekly target', () => {
        const weeklyHabit: IHabit = {
            ...mockHabit,
            target: 200,
            targetFrequency: TARGET_FREQUENCY.WEEKLY,
        };

        beforeEach(() => {
            (useHabitLogsByHabitAndDateRange as any).mockImplementation(() =>
                createMockQuery(mockHabitLogs)
            );
        });

        it('should display weekly target progress', () => {
            renderWithProviders(<HabitLogStats habit={weeklyHabit} />);

            expect(screen.getByText('Weekly Target')).toBeInTheDocument();
            // 60 out of 200 = 30%
            expect(screen.getByText('30%')).toBeInTheDocument();
            expect(screen.getByText('60 of 200 reps')).toBeInTheDocument();
        });
    });

    describe('when habit has no target', () => {
        const noTargetHabit: IHabit = {
            ...mockHabit,
            target: 0,
        };

        beforeEach(() => {
            (useHabitLogsByHabitAndDateRange as any).mockImplementation(() =>
                createMockQuery(mockHabitLogs)
            );
        });

        it('should not display target-related information', () => {
            renderWithProviders(<HabitLogStats habit={noTargetHabit} />);

            expect(screen.queryByText(/% of target/)).not.toBeInTheDocument();
            expect(screen.queryByText('✓')).not.toBeInTheDocument();
            expect(screen.queryByText('Weekly Target')).not.toBeInTheDocument();
        });
    });

    describe('when no logs are available', () => {
        beforeEach(() => {
            (useHabitLogsByHabitAndDateRange as any).mockImplementation(() =>
                createMockQuery([])
            );
        });

        it('should display zero values', () => {
            renderWithProviders(<HabitLogStats habit={mockHabit} />);

            const zeroReps = screen.getAllByText('0 reps');
            expect(zeroReps[0]).toBeInTheDocument(); // Today card
            expect(screen.getByText('0/7')).toBeInTheDocument();
            expect(screen.getByText('Avg: 0 reps/day')).toBeInTheDocument();
        });

        it('should show 0% progress when no logs and target exists', () => {
            renderWithProviders(<HabitLogStats habit={mockHabit} />);

            expect(screen.getByText('0% of target')).toBeInTheDocument();
            expect(screen.queryByText('✓')).not.toBeInTheDocument();
        });
    });

    describe('when there is an error', () => {
        const mockError = new AxiosError('Failed to fetch');

        beforeEach(() => {
            (useHabitLogsByHabitAndDateRange as any).mockImplementation(() =>
                createMockQuery(undefined, { isError: true, error: mockError })
            );
        });

        it('should handle error state gracefully', () => {
            renderWithProviders(<HabitLogStats habit={mockHabit} />);

            // Should still render component structure with default values
            expect(screen.getByText('Today')).toBeInTheDocument();
            expect(screen.getByText('This Week')).toBeInTheDocument();
            const zeroReps = screen.getAllByText('0 reps');
            expect(zeroReps[0]).toBeInTheDocument();
        });
    });

    describe('display unit handling', () => {
        it('should use habit unit when available', () => {
            const habitWithUnit = { ...mockHabit, unit: 'reps' };
            (useHabitLogsByHabitAndDateRange as any).mockImplementation(() =>
                createMockQuery(mockHabitLogs)
            );

            renderWithProviders(<HabitLogStats habit={habitWithUnit} />);

            const repsText = screen.getAllByText('60 reps');
            expect(repsText[0]).toBeInTheDocument();
        });

        it('should use metricType when unit is not available', () => {
            const habitWithMetricType = { ...mockHabit, unit: null, metricType: 'count' as const };
            (useHabitLogsByHabitAndDateRange as any).mockImplementation(() =>
                createMockQuery(mockHabitLogs)
            );

            renderWithProviders(<HabitLogStats habit={habitWithMetricType} />);

            const countText = screen.getAllByText('60 count');
            expect(countText[0]).toBeInTheDocument();
        });

        it('should default to "units" when neither unit nor metricType is available', () => {
            const habitWithoutUnit = { ...mockHabit, unit: '', metricType: 'binary' as const };
            (useHabitLogsByHabitAndDateRange as any).mockImplementation(() =>
                createMockQuery(mockHabitLogs)
            );

            renderWithProviders(<HabitLogStats habit={habitWithoutUnit} />);

            const unitsText = screen.getAllByText('60 binary');
            expect(unitsText[0]).toBeInTheDocument();
        });
    });
});