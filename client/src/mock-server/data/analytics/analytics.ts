import type { IAnalyticsResponse } from '@/types';

const analytics: IAnalyticsResponse = {
    period: 'weekly',
    startDate: '2026-06-29',
    endDate: '2026-07-05',
    totalHabitsTracked: 3,
    totalSessions: 9,
    totalMinutes: 420,
    averageSessionDuration: 46.7,
    activeDays: 5,
    totalDays: 7,
    activityRate: 71.4,
    currentStreak: 3,
    longestStreak: 12,
    habitBreakdown: [
        {
            habitId: 1,
            name: 'Deep Work',
            category: 'Work',
            sessionCount: 4,
            totalMinutes: 240,
            averageSessionDuration: 60,
            completionRate: 80,
            consistencyScore: 78,
            targetAchievementRate: 75,
            currentStreak: 3
        },
        {
            habitId: 2,
            name: 'Reading',
            category: 'Learning',
            sessionCount: 3,
            totalMinutes: 90,
            averageSessionDuration: 30,
            completionRate: 85,
            consistencyScore: 82,
            targetAchievementRate: 90,
            currentStreak: 5
        }
    ],
    categoryBreakdown: [
        {
            category: 'Work',
            sessionCount: 4,
            totalSessions: 9,
            totalMinutes: 240,
            averageSessionDuration: 60,
            habitCount: 1,
            completionRate: 80,
            targetAchievementRate: 75,
            consistencyScore: 78
        }
    ],
    dailyProgress: [
        {
            date: '2026-06-30',
            sessionCount: 2,
            totalMinutes: 95,
            completionRate: 75,
            averageSessionDuration: 47.5,
            activeHabits: 2,
            activityIntensity: 3,
            habitsCompleted: 2
        },
        {
            date: '2026-07-01',
            sessionCount: 3,
            totalMinutes: 130,
            completionRate: 85,
            averageSessionDuration: 43.3,
            activeHabits: 3,
            activityIntensity: 4,
            habitsCompleted: 3
        }
    ],
    goalProgress: {
        totalGoals: 3,
        achievedGoals: 2,
        achievementRate: 66.7,
        weeklyTargetsMet: 2,
        weeklyTargetsTotal: 3,
        monthlyTargetsMet: 1,
        monthlyTargetsTotal: 1,
        progressPercentage: 78,
        actualMinutes: 420,
        targetMinutesPerPeriod: 540,
        onTrack: true,
        actualSessions: 9,
        targetSessionsPerPeriod: 10,
        requiredDailyAverage: 40,
        daysRemaining: 2
    }
};

export default analytics;
