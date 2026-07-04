import type { IActivityGridResponse, IActivityStatisticsResponse } from '@/types';

const activityGrid: IActivityGridResponse[] = [
    {
        date: '2026-06-30',
        activityCount: 0,
        totalValue: 0,
        intensityLevel: 0,
        habitsSummary: []
    },
    {
        date: '2026-07-01',
        activityCount: 3,
        totalValue: 155,
        intensityLevel: 4,
        habitsSummary: [
            {
                habitId: 1,
                habitName: 'Deep Work',
                metricType: 'duration',
                unit: 'minutes',
                value: 90,
                color: '#2563EB',
                icon: 'Clock'
            },
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
    },
    {
        date: '2026-07-02',
        activityCount: 1,
        totalValue: 45,
        intensityLevel: 1,
        habitsSummary: [
            {
                habitId: 3,
                habitName: 'Workout',
                metricType: 'duration',
                unit: 'minutes',
                value: 45,
                color: '#DC2626',
                icon: 'Dumbbell'
            }
        ]
    },
    {
        date: '2026-07-03',
        activityCount: 4,
        totalValue: 205,
        intensityLevel: 4,
        habitsSummary: [
            {
                habitId: 4,
                habitName: 'Hydration',
                metricType: 'count',
                unit: 'glasses',
                value: 8,
                color: '#0EA5E9',
                icon: 'Droplets'
            },
            {
                habitId: 6,
                habitName: 'Language Study',
                metricType: 'count',
                unit: 'flashcards',
                value: 40,
                color: '#F59E0B',
                icon: 'Languages'
            }
        ]
    },
    {
        date: '2026-07-04',
        activityCount: 2,
        totalValue: 78,
        intensityLevel: 2,
        habitsSummary: [
            {
                habitId: 7,
                habitName: 'Commute Walking',
                metricType: 'distance',
                unit: 'km',
                value: 6.2,
                color: '#14B8A6',
                icon: 'Footprints'
            }
        ]
    }
];

const activityStatistics: IActivityStatisticsResponse = {
    totalDaysTracked: 45,
    totalActiveDays: 31,
    totalActivities: 98,
    totalHabits: 7,
    activeHabits: 6,
    totalValue: 6120,
    averageValue: 62.4,
    completionRate: 82.1,
    currentOverallStreak: 7,
    longestOverallStreak: 18,
    mostActiveDayOfWeek: 2,
    mostActiveDayName: 'Tuesday',
    bestPerformingHabit: {
        habitId: 1,
        habitName: 'Deep Work',
        totalValue: 1940,
        activityCount: 26,
        completionRate: 88.7
    },
    monthlyStats: [
        {
            year: 2026,
            month: 4,
            monthName: 'April',
            activityCount: 18,
            totalValue: 960,
            activeDays: 10
        },
        {
            year: 2026,
            month: 5,
            monthName: 'May',
            activityCount: 24,
            totalValue: 1320,
            activeDays: 14
        },
        {
            year: 2026,
            month: 6,
            monthName: 'June',
            activityCount: 28,
            totalValue: 1860,
            activeDays: 16
        },
        {
            year: 2026,
            month: 7,
            monthName: 'July',
            activityCount: 28,
            totalValue: 1980,
            activeDays: 17
        }
    ],
    weeklyStats: [
        {
            weekStartDate: '2026-06-08',
            weekEndDate: '2026-06-14',
            activityCount: 20,
            totalValue: 1180,
            activeDays: 6
        },
        {
            weekStartDate: '2026-06-15',
            weekEndDate: '2026-06-21',
            activityCount: 24,
            totalValue: 1420,
            activeDays: 7
        },
        {
            weekStartDate: '2026-06-22',
            weekEndDate: '2026-06-28',
            activityCount: 26,
            totalValue: 1500,
            activeDays: 6
        },
        {
            weekStartDate: '2026-06-29',
            weekEndDate: '2026-07-05',
            activityCount: 28,
            totalValue: 1620,
            activeDays: 7
        }
    ]
};

export { activityGrid, activityStatistics };
