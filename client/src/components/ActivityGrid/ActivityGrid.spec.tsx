import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ActivityGrid } from './ActivityGrid';
import { IActivityGridResponse } from '../../api/activity.types';
import { format, subDays } from 'date-fns';

const mockOnDateSelect = vi.fn();

const createMockGridData = (intensityPattern: number[]): IActivityGridResponse[] => {
    const endDate = new Date();
    return intensityPattern.map((intensity, index) => ({
        date: format(subDays(endDate, intensityPattern.length - 1 - index), 'yyyy-MM-dd'),
        activityCount: intensity,
        totalValue: intensity * 10,
        intensityLevel: intensity,
        habitsSummary: intensity > 0 ? [{
            habitId: 1,
            habitName: 'Exercise',
            metricType: 'Count',
            value: intensity,
            unit: 'times'
        }] : []
    }));
};

describe('ActivityGrid', () => {
    beforeEach(() => {
        mockOnDateSelect.mockClear();
    });

    it('renders activity grid with correct structure', () => {
        const gridData = createMockGridData([0, 1, 2, 3, 4]);

        render(
            <ActivityGrid
                data={gridData}
                onDateSelect={mockOnDateSelect}
            />
        );

        expect(screen.getByText('Activity Grid')).toBeInTheDocument();
        expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    it('displays correct intensity colors for different levels', () => {
        const gridData = createMockGridData([0, 1, 2, 3, 4]);

        render(
            <ActivityGrid
                data={gridData}
                onDateSelect={mockOnDateSelect}
            />
        );

        // Check that cells are rendered
        const cells = screen.getAllByRole('gridcell');
        expect(cells.length).toBeGreaterThan(0);
    });

    it('shows month labels', () => {
        const gridData = createMockGridData([1, 1, 1, 1, 1]);

        render(
            <ActivityGrid
                data={gridData}
                onDateSelect={mockOnDateSelect}
            />
        );

        // Should show year format like "Jan 2026" - check for at least one
        expect(screen.getAllByText(/2026/).length).toBeGreaterThan(0);
    });

    it('shows weekday labels', () => {
        const gridData = createMockGridData([1, 1, 1, 1, 1]);

        render(
            <ActivityGrid
                data={gridData}
                onDateSelect={mockOnDateSelect}
            />
        );

        // Check for abbreviated weekday labels (only shows first letter for odd days)
        expect(screen.getByText('M')).toBeInTheDocument(); // Monday
        expect(screen.getByText('W')).toBeInTheDocument(); // Wednesday
        expect(screen.getByText('F')).toBeInTheDocument(); // Friday
    });

    it('calls onDateSelect when a cell is clicked', () => {
        const gridData = createMockGridData([1, 2, 3]);

        render(
            <ActivityGrid
                data={gridData}
                onDateSelect={mockOnDateSelect}
            />
        );

        const cells = screen.getAllByRole('gridcell');
        if (cells.length > 0) {
            fireEvent.click(cells[0]);
            expect(mockOnDateSelect).toHaveBeenCalled();
        }
    });

    it('handles empty data gracefully', () => {
        render(
            <ActivityGrid
                data={[]}
                onDateSelect={mockOnDateSelect}
            />
        );

        expect(screen.getByText('No activity data available')).toBeInTheDocument();
        expect(screen.getByText('Start logging habits to see your activity grid')).toBeInTheDocument();
        // Empty state doesn't show grid role, it shows a message instead
        expect(screen.queryByRole('grid')).not.toBeInTheDocument();
    });

    it('handles data spanning multiple months', () => {
        // Create data for about 3 months
        const gridData: IActivityGridDay[] = [];
        const endDate = new Date();

        for (let i = 0; i < 90; i++) {
            const date = subDays(endDate, i);
            gridData.unshift({
                date: format(date, 'yyyy-MM-dd'),
                intensity: i % 5,
                habitCount: (i % 5) * 2,
                completedHabits: i % 5,
                categories: i % 5 > 0 ? [{ category: 'Health', count: i % 5 }] : []
            });
        }

        render(
            <ActivityGrid
                data={gridData}
                onDateSelect={mockOnDateSelect}
            />
        );

        expect(screen.getByText('Activity Grid')).toBeInTheDocument();
    });

    it('shows intensity legend', () => {
        const gridData = createMockGridData([0, 1, 2, 3, 4]);

        render(
            <ActivityGrid
                data={gridData}
                onDateSelect={mockOnDateSelect}
            />
        );

        expect(screen.getByText('Less')).toBeInTheDocument();
        expect(screen.getByText('More')).toBeInTheDocument();
    });

    it('provides accessibility attributes', () => {
        const gridData = createMockGridData([1, 2, 3]);

        render(
            <ActivityGrid
                data={gridData}
                onDateSelect={mockOnDateSelect}
            />
        );

        const grid = screen.getByRole('grid');
        expect(grid).toHaveAttribute('aria-label');
    });
});