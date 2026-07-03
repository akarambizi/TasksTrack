import type { IActivityGridResponse, IActivityStatisticsResponse } from '@/types';

const activityGrid: IActivityGridResponse[] = [
    {
        date: '2026-06-30',
        activityCount: 2,
        totalValue: 130,
        intensityLevel: 3,
        habitsSummary: [
            {
                habitId: 1,
                habitName: 'Deep Work',
                metricType: 'duration',
                unit: 'minutes',
                value: 90,
                color: '#2563EB',
                icon: 'Clock'
            }
        ]
    },
    {
        date: '2026-07-01',
        activityCount: 3,
        totalValue: 155,
        intensityLevel: 4,
        habitsSummary: [
            {
                habitId: 2,
                habitName: 'Reading',
                metricType: 'count',
                unit: 'pages',
                value: 25,
                color: '#059669',
                icon: 'BookOpen'
            }
        ]
    }
];

const activityStatistics: IActivityStatisticsResponse = {
    totalDaysTracked: 30,
    totalActiveDays: 21,
    totalActivities: 64,
    totalHabits: 3,
    activeHabits: 3,
    totalValue: 3480,
    averageValue: 54.3,
    completionRate: 78.4,
    currentOverallStreak: 3,
    longestOverallStreak: 12,
    mostActiveDayOfWeek: 2,
    mostActiveDayName: 'Tuesday',
    bestPerformingHabit: {
        habitId: 1,
        habitName: 'Deep Work',
        totalValue: 1280,
        activityCount: 18,
        completionRate: 82.1
    },
    monthlyStats: [
        {
            year: 2026,
            month: 7,
            monthName: 'July',
            activityCount: 20,
            totalValue: 1100,
            activeDays: 8
        }
    ],
    weeklyStats: [
        {
            weekStartDate: '2026-06-29',
            weekEndDate: '2026-07-05',
            activityCount: 9,
            totalValue: 420,
            activeDays: 5
        }
    ]
};

export { activityGrid, activityStatistics };
