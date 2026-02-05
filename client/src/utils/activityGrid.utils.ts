import { format, startOfWeek, endOfWeek } from 'date-fns';
import { IActivityGridResponse } from '../api/activity.types';

/**
 * Activity grid utility functions for organizing and formatting activity data
 */

/**
 * Creates weeks array for activity grid visualization
 * Organizes activity data into weeks starting from Sunday
 */
export const createWeeksFromActivityData = (data: IActivityGridResponse[]): IActivityGridResponse[][] => {
    if (!data.length) return [];

    const startDate = new Date(data[0].date);
    const endDate = new Date(data[data.length - 1].date);

    // Find the Sunday of the first week using date-fns
    const firstSunday = startOfWeek(startDate, { weekStartsOn: 0 }); // 0 = Sunday

    // Find the Saturday of the last week using date-fns
    const lastSaturday = endOfWeek(endDate, { weekStartsOn: 0 });

    const weeks: IActivityGridResponse[][] = [];
    let currentWeek: IActivityGridResponse[] = [];

    // Create data map for quick lookup
    const dataMap = data.reduce((acc, item) => {
        acc[item.date] = item;
        return acc;
    }, {} as Record<string, IActivityGridResponse>);

    // Generate all days from first Sunday to last Saturday
    const current = new Date(firstSunday);
    while (current <= lastSaturday) {
        const dateString = format(current, 'yyyy-MM-dd');
        const dayData = dataMap[dateString] || createEmptyDayData(dateString);

        currentWeek.push(dayData);

        // If it's Saturday or we've reached 7 days, start a new week
        if (current.getDay() === 6 || currentWeek.length === 7) {
            weeks.push([...currentWeek]);
            currentWeek = [];
        }

        current.setDate(current.getDate() + 1);
    }

    // Add remaining days if any
    if (currentWeek.length > 0) {
        weeks.push(currentWeek);
    }

    return weeks;
};

/**
 * Creates an empty day data object for days without activity
 */
export const createEmptyDayData = (date: string): IActivityGridResponse => ({
    date,
    activityCount: 0,
    totalValue: 0,
    intensityLevel: 0,
    habitsSummary: []
});

/**
 * Formats tooltip date for activity grid cells
 */
export const formatActivityTooltipDate = (dateString: string): string => {
    return format(new Date(dateString), 'MMM d, yyyy');
};

/**
 * Creates tooltip content for activity grid cells
 */
export const createActivityTooltipContent = (dayData: IActivityGridResponse): string => {
    const { activityCount, totalValue, habitsSummary = [] } = dayData;

    if (activityCount === 0) {
        return 'No activity';
    }

    const habitsList = habitsSummary
        .map(habit => `${habit.habitName}: ${habit.value} ${habit.unit || ''}`)
        .join('\n');

    return `${activityCount} ${activityCount === 1 ? 'activity' : 'activities'}\nTotal: ${totalValue}\n\n${habitsList}`;
};

/**
 * Checks if a date is today
 */
export const isDateToday = (dateString: string): boolean => {
    return dateString === format(new Date(), 'yyyy-MM-dd');
};

/**
 * Gets date range labels for activity grid header
 */
export const getActivityDateRangeLabels = (data: IActivityGridResponse[]): {
    startLabel: string;
    endLabel: string;
} => {
    if (!data.length) {
        return { startLabel: '', endLabel: '' };
    }

    return {
        startLabel: format(new Date(data[0].date), 'MMM yyyy'),
        endLabel: format(new Date(data[data.length - 1].date), 'MMM yyyy')
    };
};

/**
 * Gets month labels for the activity grid weeks layout
 */
export const getMonthLabelsForWeeks = (weeks: IActivityGridResponse[][]): Array<{ label: string; weeks: number }> => {
    if (!weeks.length) return [];

    const monthLabels: Array<{ label: string; weeks: number }> = [];
    let currentMonth = '';
    let weekCount = 0;

    for (const week of weeks) {
        if (!week.length) continue;
        
        // Get the first day of the week that has data
        const firstDay = week.find(day => day.date) || week[0];
        const monthLabel = format(new Date(firstDay.date), 'MMM');
        
        if (monthLabel !== currentMonth) {
            if (currentMonth) {
                monthLabels.push({ label: currentMonth, weeks: weekCount });
            }
            currentMonth = monthLabel;
            weekCount = 1;
        } else {
            weekCount++;
        }
    }

    // Add the last month
    if (currentMonth) {
        monthLabels.push({ label: currentMonth, weeks: weekCount });
    }

    return monthLabels;
};