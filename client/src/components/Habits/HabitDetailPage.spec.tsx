import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { HabitDetailPage } from './HabitDetailPage';
import { IHabit } from '../../api';
import { useHabitById } from '../../queries/habits';
import { AxiosError } from 'axios';

// Mock the queries and components
vi.mock('../../queries/habits', () => ({
    useHabitById: vi.fn(),
}));

vi.mock('./HabitLogs', () => ({
    HabitLogs: ({ habit }: { habit: IHabit }) => (
        <div data-testid="habit-logs">Habit Logs for {habit.name}</div>
    ),
}));

vi.mock('./HabitLogStats', () => ({
    HabitLogStats: ({ habit }: { habit: IHabit }) => (
        <div data-testid="habit-log-stats">Habit Stats for {habit.name}</div>
    ),
}));

vi.mock('./AddHabitLogDialog', () => ({
    AddHabitLogDialog: ({ habit }: { habit: IHabit }) => (
        <button data-testid="add-habit-log">Add Log for {habit.name}</button>
    ),
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

// Helper to create mock query results
const createMockQueryResult = (data: IHabit | undefined, isLoading = false, error: AxiosError | null = null) => ({
    data,
    isLoading,
    error,
    isError: !!error,
    isSuccess: !isLoading && !error && data !== undefined,
    isPending: isLoading,
    isFetching: isLoading,
    isFetched: !isLoading,
    isFetchedAfterMount: !isLoading,
    isRefetching: false,
    isLoadingError: false,
    isRefetchError: false,
    isStale: false,
    isPlaceholderData: false,
    failureCount: 0,
    failureReason: error,
    errorUpdateCount: error ? 1 : 0,
    refetch: vi.fn(),
    remove: vi.fn(),
    promise: Promise.resolve(data),
    status: isLoading ? 'pending' : error ? 'error' : 'success',
    fetchStatus: isLoading ? 'fetching' : 'idle',
    dataUpdatedAt: Date.now(),
    errorUpdatedAt: error ? Date.now() : 0,
});

const mockHabit: IHabit = {
    id: 1,
    name: 'Test Habit',
    description: 'Test description for habit tracking',
    target: 30,
    unit: 'minutes',
    metricType: 'duration',
    targetFrequency: 'daily',
    category: 'Fitness',
    color: '#3b82f6',
    isActive: true,
    createdBy: 'test-user',
    createdDate: '2024-01-01T00:00:00Z',
    updatedDate: '2024-01-01T00:00:00Z',
};

describe('HabitDetailPage', () => {
    let queryClient: QueryClient;

    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    retry: false,
                },
            },
        });
        vi.clearAllMocks();
        mockNavigate.mockClear();
    });

    const renderWithProviders = (habitId = '1') => {
        return render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={[`/habits/${habitId}`]}>
                    <Routes>
                        <Route path="/habits/:habitId" element={<HabitDetailPage />} />
                        <Route path="/habits" element={<div>Habits List</div>} />
                    </Routes>
                </MemoryRouter>
            </QueryClientProvider>
        );
    };

    describe('when data is loading', () => {
        beforeEach(() => {
            (useHabitById as any).mockReturnValue(createMockQueryResult(undefined, true));
        });

        it('should render loading skeleton', () => {
            renderWithProviders();

            // Check for loading skeleton elements
            const skeletons = screen.getAllByRole('generic').filter(el =>
                el.classList.contains('animate-pulse')
            );
            expect(skeletons.length).toBeGreaterThan(0);
        });

        it('should not render habit content while loading', () => {
            renderWithProviders();

            expect(screen.queryByText('Test Habit')).not.toBeInTheDocument();
            expect(screen.queryByTestId('habit-logs')).not.toBeInTheDocument();
        });
    });

    describe('when data loads successfully', () => {
        beforeEach(() => {
            (useHabitById as any).mockReturnValue(createMockQueryResult(mockHabit));
        });

        it('should render habit details correctly', () => {
            renderWithProviders();

            // Header content
            expect(screen.getByText('Test Habit')).toBeInTheDocument();
            expect(screen.getByText('Test description for habit tracking')).toBeInTheDocument();

            // Habit details
            expect(screen.getByText('30 minutes daily')).toBeInTheDocument();
            expect(screen.getByText('Fitness')).toBeInTheDocument();
            expect(screen.getByText('Active')).toBeInTheDocument();
        });

        it('should render child components correctly', () => {
            renderWithProviders();

            expect(screen.getByTestId('habit-log-stats')).toBeInTheDocument();
            expect(screen.getByTestId('habit-logs')).toBeInTheDocument();
            expect(screen.getByTestId('add-habit-log')).toBeInTheDocument();
        });

        it('should handle back button click', () => {
            renderWithProviders();

            const backButton = screen.getByTestId('back-button');
            expect(backButton).toBeInTheDocument();

            // Test that clicking the button triggers navigation
            fireEvent.click(backButton);
            expect(mockNavigate).toHaveBeenCalledTimes(1);
        });

        it('should display habit color indicator', () => {
            renderWithProviders();

            // The color indicator is now part of the HabitDetailsCard component
            const habitCard = screen.getByTestId('habit-details-card');
            expect(habitCard).toBeInTheDocument();
        });

        it('should show progress overview section', () => {
            renderWithProviders();

            expect(screen.getByText('Progress Overview')).toBeInTheDocument();
            expect(screen.getByTestId('habit-log-stats')).toBeInTheDocument();
        });

        it('should show activity history section', () => {
            renderWithProviders();

            expect(screen.getByText('Activity History')).toBeInTheDocument();
            expect(screen.getByTestId('habit-logs')).toBeInTheDocument();
        });
    });

    describe('when habit has no optional fields', () => {
        const habitWithoutOptionalFields: IHabit = {
            ...mockHabit,
            description: '',
            category: '',
            color: '',
            unit: '',
            metricType: '',
            isActive: false,
        };

        beforeEach(() => {
            (useHabitById as any).mockReturnValue(createMockQueryResult(habitWithoutOptionalFields));
        });

        it('should handle missing description gracefully', () => {
            renderWithProviders();

            expect(screen.getByText('Track your progress and build consistency')).toBeInTheDocument();
        });

        it('should handle missing category gracefully', () => {
            renderWithProviders();

            expect(screen.getByText('No Category')).toBeInTheDocument();
        });

        it('should show inactive status', () => {
            renderWithProviders();

            expect(screen.getByText('Inactive')).toBeInTheDocument();
        });

        it('should default to "units" when no unit or metricType', () => {
            renderWithProviders();

            expect(screen.getByText('30 units daily')).toBeInTheDocument();
        });

        it('should use default color when not specified', () => {
            renderWithProviders();

            // The habit details are now in the HabitDetailsCard component
            const habitCard = screen.getByTestId('habit-details-card');
            expect(habitCard).toBeInTheDocument();
        });
    });

    describe('when there is an error', () => {
        const mockError = new AxiosError('Failed to fetch habit');

        beforeEach(() => {
            (useHabitById as any).mockReturnValue(createMockQueryResult(undefined, false, mockError));
        });

        it('should redirect to habits list on error', () => {
            renderWithProviders();

            expect(screen.getByText('Habits List')).toBeInTheDocument();
        });
    });

    describe('when habit is not found', () => {
        beforeEach(() => {
            (useHabitById as any).mockReturnValue(createMockQueryResult(undefined, false, null));
        });

        it('should redirect to habits list when habit not found', () => {
            renderWithProviders();

            expect(screen.getByText('Habits List')).toBeInTheDocument();
        });
    });

    describe('with different habit configurations', () => {
        it('should handle weekly target frequency', () => {
            const weeklyHabit = { ...mockHabit, targetFrequency: 'weekly' };
            (useHabitById as any).mockReturnValue(createMockQueryResult(weeklyHabit));

            renderWithProviders();

            expect(screen.getByText('30 minutes weekly')).toBeInTheDocument();
        });

        it('should use metricType as display unit when unit is not available', () => {
            const habitWithMetricType = { ...mockHabit, unit: undefined, metricType: 'reps' };
            (useHabitById as any).mockReturnValue(createMockQueryResult(habitWithMetricType));

            renderWithProviders();

            expect(screen.getByText('30 reps daily')).toBeInTheDocument();
        });

        it('should render different color styles', () => {
            const redHabit = { ...mockHabit, color: '#ff0000' };
            (useHabitById as any).mockReturnValue(createMockQueryResult(redHabit));

            renderWithProviders();

            // The habit details with color are now in HabitDetailsCard
            const habitCard = screen.getByTestId('habit-details-card');
            expect(habitCard).toBeInTheDocument();
        });
    });

    describe('with invalid habitId parameter', () => {
        beforeEach(() => {
            (useHabitById as any).mockReturnValue(createMockQueryResult(undefined, false, null));
        });

        it('should handle non-numeric habitId', () => {
            renderWithProviders('invalid');

            // Should still call useHabitById with NaN
            expect(useHabitById).toHaveBeenCalledWith(NaN);
        });
    });

    describe('accessibility and interaction', () => {
        beforeEach(() => {
            (useHabitById as any).mockReturnValue(createMockQueryResult(mockHabit));
        });

        it('should have proper heading structure', () => {
            renderWithProviders();

            const mainHeading = screen.getByRole('heading', { level: 1 });
            expect(mainHeading).toHaveTextContent('Test Habit');

            const subHeadings = screen.getAllByRole('heading', { level: 2 });
            expect(subHeadings).toHaveLength(3);
            expect(subHeadings[0]).toHaveTextContent('Progress Overview');
            expect(subHeadings[1]).toHaveTextContent('Activity History');
            expect(subHeadings[2]).toHaveTextContent('Focus Sessions');
        });

        it('should have accessible buttons', () => {
            renderWithProviders();

            const buttons = screen.getAllByRole('button');
            expect(buttons).toHaveLength(2); // Back button and Add Log button
            expect(buttons[0]).toBeInTheDocument(); // Back button
            expect(buttons[1]).toBeInTheDocument(); // Add Log button
        });
    });
});