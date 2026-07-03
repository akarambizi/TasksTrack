import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '@/utils/test-utils';
import { yearlySnapshots } from '@/mock-server/data/analytics/growthMetrics';
import { MultiYearComparisonChart, TYearMetric } from './MultiYearComparisonChart';

if (!HTMLElement.prototype.hasPointerCapture) {
    HTMLElement.prototype.hasPointerCapture = () => false;
}

if (!HTMLElement.prototype.setPointerCapture) {
    HTMLElement.prototype.setPointerCapture = () => {};
}

if (!HTMLElement.prototype.releasePointerCapture) {
    HTMLElement.prototype.releasePointerCapture = () => {};
}

const StatefulChart = () => {
    const [metric, setMetric] = useState<TYearMetric>('goalCompletionRate');

    return (
        <MultiYearComparisonChart
            snapshots={yearlySnapshots}
            selectedMetric={metric}
            onMetricChange={setMetric}
            title="Yearly Comparison Chart"
            description="Mock metric switch test"
        />
    );
};

describe('MultiYearComparisonChart', () => {
    it('switches metrics and updates values in the chart', async () => {
        const user = userEvent.setup();

        renderWithProviders(<StatefulChart />);

        expect(screen.getByText(/Metric: Goal Completion Rate/i)).toBeInTheDocument();
        expect(screen.getByText(/\+5 %/i)).toBeInTheDocument();

        await user.click(screen.getByRole('combobox'));
        await user.click(screen.getByText('Focus Minutes'));

        expect(screen.getByText(/Metric: Focus Minutes/i)).toBeInTheDocument();
        expect(screen.getByText(/\+12,640 min/i)).toBeInTheDocument();
        expect(screen.getByText(/49,120\s*min/i)).toBeInTheDocument();
    });
});
