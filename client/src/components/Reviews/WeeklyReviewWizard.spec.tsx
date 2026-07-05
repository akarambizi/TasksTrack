import { cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { renderWithProviders } from '@/utils/test-utils';
import { WeeklyReviewWizard } from './WeeklyReviewWizard';

const LOCAL_STORAGE_KEY = 'taskstrack.weekly-review.wizard.v1';

describe('WeeklyReviewWizard', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    afterEach(() => {
        cleanup();
    });

    it('persists wizard step transitions to local storage', async () => {
        const user = userEvent.setup();

        const { unmount } = renderWithProviders(<WeeklyReviewWizard />);

        expect(screen.getByText(/Step 1 \/ 3/i)).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Next' }));

        expect(screen.getByText(/Step 2 \/ 3/i)).toBeInTheDocument();

        const persistedAfterStepTwo = localStorage.getItem(LOCAL_STORAGE_KEY);
        expect(persistedAfterStepTwo).toContain('"step":2');

        unmount();
        renderWithProviders(<WeeklyReviewWizard />);

        expect(screen.getByText(/Step 2 \/ 3/i)).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Next' }));

        expect(screen.getByText(/Step 3 \/ 3/i)).toBeInTheDocument();

        await user.type(screen.getByLabelText('Next week plan'), 'Protect deep work blocks Monday to Friday.');
        await user.click(screen.getByRole('button', { name: 'Complete Review' }));

        expect(screen.getByText(/Last submitted:/i)).toBeInTheDocument();
    });

    it('hydrates existing saved wizard state from local storage', () => {
        localStorage.setItem(
            LOCAL_STORAGE_KEY,
            JSON.stringify({
                step: 2,
                checklist: [
                    { id: 'wr-1', label: 'Reviewed weekly goals', completed: true },
                    { id: 'wr-2', label: 'Planned recovery actions', completed: true }
                ],
                confidenceScore: 9,
                wins: 'Shipped weekly goals UI',
                blockers: 'Too many context switches',
                nextWeekPlan: '',
                submittedAt: null
            })
        );

        renderWithProviders(<WeeklyReviewWizard />);

        expect(screen.getByText(/Step 2 \/ 3/i)).toBeInTheDocument();
        expect(screen.getByDisplayValue('9')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Shipped weekly goals UI')).toBeInTheDocument();
    });
});
