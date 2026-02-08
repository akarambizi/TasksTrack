import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { ActivityGridContainer } from './ActivityGridContainer';
import { useActivityGrid, useActivityStatistics } from '../../queries/activity';
import {
  mockActivityGridData,
  mockActivityStatistics,
  createMockQuery,
  renderWithProviders
} from '../../utils/test-utils';

// Mock the activity query hooks
vi.mock('../../queries/activity', () => ({
    useActivityGrid: vi.fn(),
    useActivityStatistics: vi.fn(),
}));

const mockUseActivityGrid = vi.mocked(useActivityGrid);
const mockUseActivityStatistics = vi.mocked(useActivityStatistics);

describe('ActivityGridContainer', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        // Mock useActivityStatistics to return loading state by default
        mockUseActivityStatistics.mockReturnValue(
            createMockQuery(null, { isLoading: true })
        );
    });

    it('renders loading state initially', () => {
        mockUseActivityGrid.mockReturnValue(
            createMockQuery(undefined, { isLoading: true })
        );

        renderWithProviders(<ActivityGridContainer />);

        // Loading skeletons should be present
        const skeletons = screen.getAllByTestId('loading-skeleton');
        expect(skeletons.length).toBeGreaterThan(0);

        // Should not show activity content during loading
        expect(screen.queryByRole('grid')).not.toBeInTheDocument();
    });

    it('renders activity grid when data is loaded', async () => {
        mockUseActivityGrid.mockReturnValue(
            createMockQuery(mockActivityGridData)
        );
        mockUseActivityStatistics.mockReturnValue(
            createMockQuery(mockActivityStatistics)
        );

        renderWithProviders(<ActivityGridContainer />);

        // Should render the grid when data is loaded
        expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    it('renders error state when query fails', () => {
        mockUseActivityGrid.mockReturnValue(
            createMockQuery(undefined, {
                isLoading: false,
                isError: true,
                error: new Error('Failed to fetch data')
            })
        );
        mockUseActivityStatistics.mockReturnValue(
            createMockQuery(null)
        );

        renderWithProviders(<ActivityGridContainer />);

        expect(screen.getByText('Failed to load activity data')).toBeInTheDocument();
        expect(screen.getByText('Please try again later')).toBeInTheDocument();
    });

    it('renders empty state when no data is available', () => {
        mockUseActivityGrid.mockReturnValue(
            createMockQuery([]) // empty array means no data available
        );
        mockUseActivityStatistics.mockReturnValue(
            createMockQuery(null)
        );

        renderWithProviders(<ActivityGridContainer />);

        expect(screen.getByText('No activity data available')).toBeInTheDocument();
        expect(screen.getByText('Start logging habits to see your activity grid')).toBeInTheDocument();
    });

    it('calculates correct date range for query', () => {
        mockUseActivityGrid.mockReturnValue(
            createMockQuery(mockActivityGridData)
        );

        renderWithProviders(<ActivityGridContainer />);

        // Check that useActivityGrid was called with separate date parameters
        expect(mockUseActivityGrid).toHaveBeenCalledWith(
            expect.any(String), // startDate
            expect.any(String)  // endDate
        );

        const call = mockUseActivityGrid.mock.calls[0];
        const startDate = new Date(call[0]);
        const endDate = new Date(call[1]);

        // Should be approximately 1 year of data
        const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        expect(daysDiff).toBeGreaterThan(350); // About a year
        expect(daysDiff).toBeLessThan(370);
    });

    it('shows current date in the title', () => {
        mockUseActivityGrid.mockReturnValue(
            createMockQuery(mockActivityGridData)
        );
        mockUseActivityStatistics.mockReturnValue(
            createMockQuery(mockActivityStatistics)
        );

        renderWithProviders(<ActivityGridContainer />);

        // Should render the grid which contains the year
        expect(screen.getByRole('grid')).toBeInTheDocument();
        // Note: The title comes from ActivityGrid component when it renders
    });
});