import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getActivityGrid, getActivityStatistics } from './activity';
import { IActivityGridResponse, IActivityStatisticsResponse } from './activity.types';
import { apiGet } from './apiClient';

// Mock dependencies
vi.mock('./apiClient');

const mockApiGet = vi.mocked(apiGet);

describe('Activity API', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('getActivityGrid', () => {
        const startDate = '2024-01-01';
        const endDate = '2024-12-31';

        it('should fetch activity grid data successfully', async () => {
            const mockResponse: IActivityGridResponse[] = [
                {
                    date: '2024-01-01',
                    activityCount: 2,
                    totalValue: 30,
                    intensityLevel: 2,
                    habitsSummary: [
                        { 
                            habitId: 1, 
                            habitName: 'Exercise', 
                            metricType: 'Count', 
                            value: 1, 
                            unit: 'times' 
                        }
                    ]
                }
            ];

            mockApiGet.mockResolvedValueOnce(mockResponse);

            const result = await getActivityGrid(startDate, endDate);

            expect(mockApiGet).toHaveBeenCalledWith(
                `/api/activity/grid?startDate=${startDate}&endDate=${endDate}`
            );
            expect(result).toEqual(mockResponse);
        });

        it('should handle API errors', async () => {
            const errorMessage = 'Failed to fetch activity grid';
            mockApiGet.mockRejectedValueOnce(new Error(errorMessage));

            const result = await getActivityGrid(startDate, endDate);

            expect(result).toEqual([]); // Function returns empty array on error
            expect(mockApiGet).toHaveBeenCalledWith(
                `/api/activity/grid?startDate=${startDate}&endDate=${endDate}`
            );
        });

        it('should handle empty response', async () => {
            mockApiGet.mockResolvedValueOnce([]);

            const result = await getActivityGrid(startDate, endDate);

            expect(result).toEqual([]);
            expect(mockApiGet).toHaveBeenCalledWith(
                `/api/activity/grid?startDate=${startDate}&endDate=${endDate}`
            );
        });
    });

    describe('getActivityStatistics', () => {
        it('should fetch activity statistics successfully', async () => {
            const mockResponse: IActivityStatisticsResponse = {
                totalDaysTracked: 365,
                totalActiveDays: 150,
                totalActivities: 450,
                totalHabits: 5,
                activeHabits: 3,
                totalValue: 1200,
                averageValue: 8,
                completionRate: 0.85,
                currentOverallStreak: 7,
                longestOverallStreak: 21,
                mostActiveDayOfWeek: 1,
                mostActiveDayName: 'Monday',
                bestPerformingHabit: {
                    habitId: 1,
                    habitName: 'Exercise',
                    totalValue: 300,
                    activityCount: 142,
                    completionRate: 0.95
                },
                monthlyStats: [
                    {
                        year: 2024,
                        month: 1,
                        monthName: 'January',
                        activityCount: 28,
                        totalValue: 200,
                        activeDays: 25
                    }
                ],
                weeklyStats: [
                    {
                        weekStartDate: '2024-01-01',
                        weekEndDate: '2024-01-07',
                        activityCount: 7,
                        totalValue: 50,
                        activeDays: 6
                    }
                ]
            };

            mockApiGet.mockResolvedValueOnce(mockResponse);

            const result = await getActivityStatistics();

            expect(mockApiGet).toHaveBeenCalledWith('/api/activity/statistics');
            expect(result).toEqual(mockResponse);
        });

        it('should handle API errors', async () => {
            const errorMessage = 'Failed to fetch activity statistics';
            mockApiGet.mockRejectedValueOnce(new Error(errorMessage));

            const result = await getActivityStatistics();

            expect(result).toBeNull(); // Function returns null on error
            expect(mockApiGet).toHaveBeenCalledWith('/api/activity/statistics');
        });

        it('should handle null response', async () => {
            mockApiGet.mockResolvedValueOnce(null);

            const result = await getActivityStatistics();

            expect(result).toBeNull();
        });
    });
});