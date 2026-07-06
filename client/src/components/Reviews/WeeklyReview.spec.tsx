import { describe, it, expect, afterEach } from 'vitest';
import { screen, cleanup } from '@testing-library/react';
import { WeeklyReview } from './WeeklyReview';
import { renderWithProviders } from '../../utils/test-utils';

describe('WeeklyReview', () => {
    afterEach(() => cleanup());

    it('renders the Weekly Review page heading', () => {
        renderWithProviders(<WeeklyReview />);
        expect(screen.getByText('Weekly Review')).toBeInTheDocument();
    });

    it('renders the description text', () => {
        renderWithProviders(<WeeklyReview />);
        expect(screen.getByText(/structured weekly reflection/i)).toBeInTheDocument();
    });

    it('renders the weekly-review-page container', () => {
        renderWithProviders(<WeeklyReview />);
        expect(screen.getByTestId('weekly-review-page')).toBeInTheDocument();
    });

    it('renders the WeeklyReviewWizard inside', () => {
        renderWithProviders(<WeeklyReview />);
        // Wizard starts at Step 1
        expect(screen.getByText(/Step 1/i)).toBeInTheDocument();
    });
});
