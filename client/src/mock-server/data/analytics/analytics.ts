import type { IAnalyticsResponse } from '@/types';

const analytics: IAnalyticsResponse = {
    period: 'weekly',
    startDate: '2026-06-29',
    endDate: '2026-07-05',
    totalHabitsTracked: 7,
    totalSessions: 18,
    totalMinutes: 1020,
    averageSessionDuration: 56.7,
    activeDays: 6,
    totalDays: 7,
    activityRate: 85.7,
    currentStreak: 7,
    longestStreak: 18,
    habitBreakdown: [
        {
            habitId: 1,
            name: 'Deep Work',
            category: 'Work',
            sessionCount: 6,
            totalMinutes: 360,
            averageSessionDuration: 60,
            completionRate: 86,
            consistencyScore: 84,
            targetAchievementRate: 82,
            currentStreak: 7
        },
        {
            habitId: 2,
            name: 'Reading',
            category: 'Learning',
            sessionCount: 4,
            totalMinutes: 120,
            averageSessionDuration: 30,
            completionRate: 92,
            consistencyScore: 88,
            targetAchievementRate: 95,
            currentStreak: 8
        },
        {
            habitId: 3,
            name: 'Workout',
            category: 'Health',
            sessionCount: 3,
            totalMinutes: 135,
            averageSessionDuration: 45,
            completionRate: 75,
            consistencyScore: 70,
            targetAchievementRate: 80,
            currentStreak: 4
        },
        {
            habitId: 4,
            name: 'Hydration',
            category: 'Health',
            sessionCount: 4,
            totalMinutes: 24,
            averageSessionDuration: 6,
            completionRate: 100,
            consistencyScore: 96,
            targetAchievementRate: 100,
            currentStreak: 12
        },
        {
            habitId: 6,
            name: 'Language Study',
            category: 'Learning',
            sessionCount: 2,
            totalMinutes: 58,
            averageSessionDuration: 29,
            completionRate: 78,
            consistencyScore: 74,
            targetAchievementRate: 76,
            currentStreak: 6
        }
    ],
    categoryBreakdown: [
        {
            category: 'Work',
            sessionCount: 7,
            totalSessions: 18,
            totalMinutes: 390,
            averageSessionDuration: 60,
            habitCount: 2,
            completionRate: 86,
            targetAchievementRate: 84,
            consistencyScore: 82
        },
        {
            category: 'Learning',
            sessionCount: 6,
            totalSessions: 18,
            totalMinutes: 210,
            averageSessionDuration: 35,
            habitCount: 2,
            completionRate: 91,
            targetAchievementRate: 90,
            consistencyScore: 89
        },
        {
            category: 'Health',
            sessionCount: 5,
            totalSessions: 18,
            totalMinutes: 420,
            averageSessionDuration: 84,
            habitCount: 3,
            completionRate: 76,
            targetAchievementRate: 79,
            consistencyScore: 73
        },
        {
            category: 'Personal',
            sessionCount: 3,
            totalSessions: 18,
            totalMinutes: 96,
            averageSessionDuration: 32,
            habitCount: 1,
            completionRate: 62,
            targetAchievementRate: 58,
            consistencyScore: 65
        }
    ],
    dailyProgress: [
        {
            date: '2026-06-29',
            sessionCount: 0,
            totalMinutes: 0,
            completionRate: 0,
            averageSessionDuration: 0,
            activeHabits: 0,
            activityIntensity: 0,
            habitsCompleted: 0
        },
        {
            date: '2026-06-30',
            sessionCount: 2,
            totalMinutes: 95,
            completionRate: 72,
            averageSessionDuration: 47.5,
            activeHabits: 2,
            activityIntensity: 2,
            habitsCompleted: 2
        },
        {
            date: '2026-07-01',
            sessionCount: 4,
            totalMinutes: 170,
            completionRate: 88,
            averageSessionDuration: 42.5,
            activeHabits: 4,
            activityIntensity: 4,
            habitsCompleted: 4
        },
        {
            date: '2026-07-02',
            sessionCount: 1,
            totalMinutes: 45,
            completionRate: 50,
            averageSessionDuration: 45,
            activeHabits: 1,
            activityIntensity: 1,
            habitsCompleted: 1
        },
        {
            date: '2026-07-03',
            sessionCount: 3,
            totalMinutes: 140,
            completionRate: 84,
            averageSessionDuration: 46.7,
            activeHabits: 3,
            activityIntensity: 4,
            habitsCompleted: 3
        }
    ],
    goalProgress: {
        totalGoals: 6,
        achievedGoals: 4,
        achievementRate: 66.7,
        weeklyTargetsMet: 3,
        weeklyTargetsTotal: 4,
        monthlyTargetsMet: 2,
        monthlyTargetsTotal: 3,
        progressPercentage: 84,
        actualMinutes: 1020,
        targetMinutesPerPeriod: 1200,
        onTrack: true,
        actualSessions: 18,
        targetSessionsPerPeriod: 20,
        requiredDailyAverage: 54,
        daysRemaining: 2
    },
    monthlyHistory: [
        { year: 2023, month: 10, monthName: 'October', activityCount: 11, totalValue: 520, activeDays: 6 },
        { year: 2023, month: 11, monthName: 'November', activityCount: 13, totalValue: 610, activeDays: 7 },
        { year: 2024, month: 10, monthName: 'October', activityCount: 14, totalValue: 680, activeDays: 8 },
        { year: 2024, month: 11, monthName: 'November', activityCount: 16, totalValue: 780, activeDays: 9 },
        { year: 2025, month: 1, monthName: 'January', activityCount: 12, totalValue: 620, activeDays: 7 },
        { year: 2025, month: 4, monthName: 'April', activityCount: 18, totalValue: 960, activeDays: 11 },
        { year: 2025, month: 7, monthName: 'July', activityCount: 23, totalValue: 1320, activeDays: 13 },
        { year: 2025, month: 12, monthName: 'December', activityCount: 27, totalValue: 1640, activeDays: 15 },
        { year: 2026, month: 3, monthName: 'March', activityCount: 24, totalValue: 1480, activeDays: 14 },
        { year: 2026, month: 6, monthName: 'June', activityCount: 28, totalValue: 1860, activeDays: 16 },
        { year: 2026, month: 7, monthName: 'July', activityCount: 28, totalValue: 1980, activeDays: 17 }
    ],
    quarterlyHistory: [
        { year: 2023, quarter: 4, quarterLabel: 'Q4', activityCount: 24, totalValue: 1130, activeDays: 13 },
        { year: 2024, quarter: 4, quarterLabel: 'Q4', activityCount: 30, totalValue: 1460, activeDays: 17 },
        { year: 2025, quarter: 1, quarterLabel: 'Q1', activityCount: 36, totalValue: 1860, activeDays: 21 },
        { year: 2025, quarter: 2, quarterLabel: 'Q2', activityCount: 48, totalValue: 2720, activeDays: 28 },
        { year: 2025, quarter: 3, quarterLabel: 'Q3', activityCount: 54, totalValue: 3120, activeDays: 31 },
        { year: 2025, quarter: 4, quarterLabel: 'Q4', activityCount: 61, totalValue: 3540, activeDays: 35 },
        { year: 2026, quarter: 1, quarterLabel: 'Q1', activityCount: 64, totalValue: 3720, activeDays: 36 },
        { year: 2026, quarter: 2, quarterLabel: 'Q2', activityCount: 71, totalValue: 4020, activeDays: 39 }
    ]
};

export default analytics;
