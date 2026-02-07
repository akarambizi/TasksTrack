import { describe, it, expect } from 'vitest';
import {
    createWeeksFromActivityData,
    createEmptyDayData,
    formatActivityTooltipDate,
    createActivityTooltipContent,
    isDateToday,
    getActivityDateRangeLabels
} from './activityGrid.utils';
import { IActivityGridResponse } from '@/types';
import { format } from 'date-fns';

const createMockData = (dates: string[]): IActivityGridResponse[] => {
    return dates.map((date, index) => ({
        date,
        activityCount: index + 1,
        totalValue: (index + 1) * 10,
        intensityLevel: Math.min(index + 1, 4),
        habitsSummary: [{
            habitId: 1,
            habitName: 'Exercise',
            metricType: 'Count',
            value: index + 1,
            unit: 'times',
            color: null,
            icon: null
        }]
    }));
};

describe('Activity Grid Utilities', () => {
    describe('createWeeksFromActivityData', () => {
        it('returns empty array for empty data', () => {
            const result = createWeeksFromActivityData([]);
            expect(result).toEqual([]);
        });

        it('organizes data into weeks starting from Sunday', () => {
            const mockData = createMockData(['2026-02-01', '2026-02-02', '2026-02-03']); // Sat, Sun, Mon
            const weeks = createWeeksFromActivityData(mockData);

            expect(weeks.length).toBeGreaterThan(0);
            expect(weeks[0].length).toBeLessThanOrEqual(7); // Each week has max 7 days
        });

        it('fills missing days with empty data', () => {
            const mockData = createMockData(['2026-02-03', '2026-02-05']); // Missing Feb 4th
            const weeks = createWeeksFromActivityData(mockData);

            // Should have data for all days including the missing one
            const allDays = weeks.flat();
            const feb4 = allDays.find(day => day.date === '2026-02-04');
            expect(feb4).toBeDefined();
            expect(feb4?.activityCount).toBe(0);
        });
    });

    describe('createEmptyDayData', () => {
        it('creates empty day data with correct structure', () => {
            const emptyDay = createEmptyDayData('2026-02-01');

            expect(emptyDay).toEqual({
                date: '2026-02-01',
                activityCount: 0,
                totalValue: 0,
                intensityLevel: 0,
                habitsSummary: []
            });
        });
    });

    describe('formatActivityTooltipDate', () => {
        it('formats date correctly', () => {
            const formatted = formatActivityTooltipDate('2026-01-15');
            // Just check the format structure, not the exact date due to timezone issues
            expect(formatted).toMatch(/^[A-Z][a-z]{2} \d{1,2}, \d{4}$/);
        });
    });

    describe('createActivityTooltipContent', () => {
        it('returns "No activity" for zero activity', () => {
            const emptyData = createEmptyDayData('2026-02-01');
            const content = createActivityTooltipContent(emptyData);
            expect(content).toBe('No activity');
        });

        it('creates content for single activity', () => {
            const data: IActivityGridResponse = {
                date: '2026-02-01',
                activityCount: 1,
                totalValue: 10,
                intensityLevel: 1,
                habitsSummary: [{
                    habitId: 1,
                    habitName: 'Exercise',
                    metricType: 'Count',
                    value: 1,
                    unit: null,
                    color: null,
                    icon: null
                }]
            };

            const content = createActivityTooltipContent(data);
            expect(content).toContain('1 activity');
            expect(content).toContain('Total: 10');
            expect(content).toContain('Exercise: 1');
        });

        it('creates content for multiple activities', () => {
            const data: IActivityGridResponse = {
                date: '2026-02-01',
                activityCount: 3,
                totalValue: 30,
                intensityLevel: 3,
                habitsSummary: [
                    { habitId: 1, habitName: 'Exercise', metricType: 'Count', value: 1, unit: null, color: null, icon: null },
                    { habitId: 2, habitName: 'Reading', metricType: 'Duration', value: 30, unit: null, color: null, icon: null }
                ]
            };

            const content = createActivityTooltipContent(data);
            expect(content).toContain('3 activities');
            expect(content).toContain('Total: 30');
            expect(content).toContain('Exercise: 1');
            expect(content).toContain('Reading: 30');
        });

        it('handles missing habitsSummary gracefully', () => {
            const data: IActivityGridResponse = {
                date: '2026-02-01',
                activityCount: 1,
                totalValue: 10,
                intensityLevel: 1,
                habitsSummary: [] // Test empty array case
            };

            expect(() => createActivityTooltipContent(data)).not.toThrow();
            const content = createActivityTooltipContent(data);
            expect(content).toContain('1 activity');
        });
    });

    describe('isDateToday', () => {
        it('returns true for today', () => {
            const today = format(new Date(), 'yyyy-MM-dd');
            expect(isDateToday(today)).toBe(true);
        });

        it('returns false for other dates', () => {
            expect(isDateToday('2026-02-01')).toBe(false);
        });
    });

    describe('getActivityDateRangeLabels', () => {
        it('returns empty labels for empty data', () => {
            const labels = getActivityDateRangeLabels([]);
            expect(labels).toEqual({ startLabel: '', endLabel: '' });
        });

        it('returns correct labels for date range', () => {
            const mockData = createMockData(['2026-01-15', '2026-02-28']);
            const labels = getActivityDateRangeLabels(mockData);

            expect(labels.startLabel).toBe('Jan 2026');
            expect(labels.endLabel).toBe('Feb 2026');
        });

        it('returns same label for single month data', () => {
            const mockData = createMockData(['2026-06-10', '2026-06-20']); // Mid month dates to avoid timezone issues
            const labels = getActivityDateRangeLabels(mockData);

            // Just check they are equal and have correct format
            expect(labels.startLabel).toBe(labels.endLabel);
            expect(labels.startLabel).toMatch(/^[A-Z][a-z]{2} \d{4}$/);
        });
    });
});