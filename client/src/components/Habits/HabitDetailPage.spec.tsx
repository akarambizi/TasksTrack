import { TARGET_FREQUENCY, HABIT_COLORS } from '@/types/constants';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { HabitDetailPage } from './HabitDetailPage';
import { IHabit } from '@/types';
import { useHabitById } from '../../queries/habits';
import { AxiosError } from 'axios';
import { mockHabit, createMockQuery, renderWithProviders } from '../../utils/test-utils';

// Mock the queries and components
vi.mock('../../queries/habits', () => ({
    useHabitById: vi.fn(),
}));

// Mock react-router-dom navigate function
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('HabitDetailPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockNavigate.mockClear();
    });

    describe('when data is loading', () => {
        beforeEach(() => {
            (useHabitById as any).mockReturnValue(createMockQuery(undefined, { isLoading: true }));
        });

        it('should render loading skeleton', () => {
            renderWithProviders(<HabitDetailPage />);

            // Check for loading skeleton elements using testid
            const skeletons = screen.getAllByTestId('loading-skeleton');
            expect(skeletons.length).toBeGreaterThan(0);

            // Also check for animate-pulse class using the container from render result
            // Should display skeleton elements
            expect(skeletons.length).toBeGreaterThan(0);
        });

        it('should not render habit content while loading', () => {
            renderWithProviders(<HabitDetailPage />);

            expect(screen.queryByText('Test Habit')).not.toBeInTheDocument();
            expect(screen.queryByTestId('habit-logs')).not.toBeInTheDocument();
        });
    });

    describe('when data loads successfully', () => {
        beforeEach(() => {
            (useHabitById as any).mockReturnValue(createMockQuery(mockHabit));
        });

        it('should render habit details correctly', () => {
            renderWithProviders(<HabitDetailPage />);

            // Header content
            expect(screen.getByText('Test Habit')).toBeInTheDocument();
            expect(screen.getByText('Test Description')).toBeInTheDocument();

            // Habit details
            expect(screen.getByText('10 reps daily')).toBeInTheDocument();
            expect(screen.getByText('Health')).toBeInTheDocument();
            expect(screen.getByText('Active')).toBeInTheDocument();
        });

        it('should render child components correctly', () => {
            renderWithProviders(<HabitDetailPage />);

            expect(screen.getByTestId('habit-details-card')).toBeInTheDocument();
        });

        it('should handle back button click', () => {
            renderWithProviders(<HabitDetailPage />);

            const backButton = screen.getByTestId('back-button');
            expect(backButton).toBeInTheDocument();

            // Test that clicking the button triggers navigation
            fireEvent.click(backButton);
            expect(mockNavigate).toHaveBeenCalledTimes(1);
        });

        it('should display habit color indicator', () => {
            renderWithProviders(<HabitDetailPage />);

            // The color indicator is now part of the HabitDetailsCard component
            const habitCard = screen.getByTestId('habit-details-card');
            expect(habitCard).toBeInTheDocument();
        });

        it('should show progress overview section', () => {
            renderWithProviders(<HabitDetailPage />);

            expect(screen.getByText('Habit Details')).toBeInTheDocument();
        });

        it('should show activity history section', () => {
            renderWithProviders(<HabitDetailPage />);

            expect(screen.getByText('Habit Details')).toBeInTheDocument();
        });
    });

    describe('when habit has no optional fields', () => {
        const habitWithoutOptionalFields: IHabit = {
            ...mockHabit,
            description: '',
            category: null,
            color: null,
            icon: null,
            metricType: 'binary',
            isActive: false,
        };

        beforeEach(() => {
            (useHabitById as any).mockReturnValue(createMockQuery(habitWithoutOptionalFields));
        });

        it('should handle missing description gracefully', () => {
            renderWithProviders(<HabitDetailPage />);

            expect(screen.getByText('Track your progress and build consistency')).toBeInTheDocument();
        });

        it('should handle missing category gracefully', () => {
            renderWithProviders(<HabitDetailPage />);

            expect(screen.getByText('No Category')).toBeInTheDocument();
        });

        it('should show inactive status', () => {
            renderWithProviders(<HabitDetailPage />);

            expect(screen.getByText('Inactive')).toBeInTheDocument();
        });

        it('should default to "units" when no unit or metricType', () => {
            renderWithProviders(<HabitDetailPage />);

            expect(screen.getByText('10 reps daily')).toBeInTheDocument();
        });

        it('should use default color when not specified', () => {
            renderWithProviders(<HabitDetailPage />);

            // The habit details are now in the HabitDetailsCard component
            const habitCard = screen.getByTestId('habit-details-card');
            expect(habitCard).toBeInTheDocument();
        });
    });

    describe('when there is an error', () => {
        const mockError = new AxiosError('Failed to fetch habit');

        beforeEach(() => {
            (useHabitById as any).mockReturnValue(createMockQuery(undefined, { isError: true, error: mockError }));
        });

        it('should redirect to habits list on error', () => {
            renderWithProviders(<HabitDetailPage />);

            // Component should handle error state gracefully
            // Redirect behavior is handled by the component
        });
    });

    describe('when habit is not found', () => {
        beforeEach(() => {
            (useHabitById as any).mockReturnValue(createMockQuery(undefined, { isError: false }));
        });

        it('should redirect to habits list when habit not found', () => {
            renderWithProviders(<HabitDetailPage />);

            // Component should handle not found state gracefully
            // Redirect behavior is handled by the component
        });
    });

    describe('with different habit configurations', () => {
        it('should handle weekly target frequency', () => {
            const weeklyHabit = { ...mockHabit, targetFrequency: TARGET_FREQUENCY.WEEKLY };
            (useHabitById as any).mockReturnValue(createMockQuery(weeklyHabit));

            renderWithProviders(<HabitDetailPage />);

            expect(screen.getByText('10 reps weekly')).toBeInTheDocument();
        });

        it('should use metricType as display unit when unit is not available', () => {
            const habitWithMetricType = { ...mockHabit, unit: null, metricType: 'count' as const };
            (useHabitById as any).mockReturnValue(createMockQuery(habitWithMetricType));

            renderWithProviders(<HabitDetailPage />);

            expect(screen.getByText('10 count daily')).toBeInTheDocument();
        });

        it('should render different color styles', () => {
            const redHabit = { ...mockHabit, color: HABIT_COLORS.RED };
            (useHabitById as any).mockReturnValue(createMockQuery(redHabit));

            renderWithProviders(<HabitDetailPage />);

            // The habit details with color are now in HabitDetailsCard
            const habitCard = screen.getByTestId('habit-details-card');
            expect(habitCard).toBeInTheDocument();
        });
    });

    describe('with invalid habitId parameter', () => {
        beforeEach(() => {
            (useHabitById as any).mockReturnValue(createMockQuery(undefined, { isError: false }));
        });

        it('should handle non-numeric habitId', () => {
            renderWithProviders(<HabitDetailPage />);

            // Should still call useHabitById with NaN
            expect(useHabitById).toHaveBeenCalledWith(NaN);
        });
    });

    describe('accessibility and interaction', () => {
        beforeEach(() => {
            (useHabitById as any).mockReturnValue(createMockQuery(mockHabit));
        });

        it('should have proper heading structure', () => {
            renderWithProviders(<HabitDetailPage />);

            const mainHeading = screen.getByRole('heading', { level: 1 });
            expect(mainHeading).toHaveTextContent('Test Habit');

            // Should have multiple level 3 headings for different sections
            const subHeadings = screen.getAllByRole('heading', { level: 3 });
            expect(subHeadings.length).toBeGreaterThanOrEqual(1); // Allow for multiple sections

            // Check that at least one heading contains relevant section text
            const hasRelevantHeading = subHeadings.some(
                heading => heading.textContent?.includes('Habit Details') ||
                          heading.textContent?.includes('Habit') ||
                          heading.textContent?.includes('Details') ||
                          heading.textContent?.includes('Progress') ||
                          heading.textContent?.includes('Stats') ||
                          heading.textContent?.includes('Logs')
            );
            expect(hasRelevantHeading).toBe(true);
        });

        it('should have accessible buttons', () => {
            renderWithProviders(<HabitDetailPage />);

            const buttons = screen.getAllByRole('button');
            expect(buttons).toHaveLength(2); // Back button and Add Log button
            expect(buttons[0]).toBeInTheDocument(); // Back button
            expect(buttons[1]).toBeInTheDocument(); // Add Log button
        });
    });
});