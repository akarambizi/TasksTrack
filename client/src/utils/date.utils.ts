import { format, parseISO, isValid, startOfDay, differenceInDays } from 'date-fns';

/**
 * Formats a date to a readable string
 * @param date Date to format (string, Date, or null/undefined)
 * @param formatString Format pattern (default: 'MMM dd, yyyy')
 * @returns Formatted date string or 'Invalid date' if parsing fails
 */
export const formatDate = (
    date: string | Date | null | undefined, 
    formatString: string = 'MMM dd, yyyy'
): string => {
    if (!date) return 'Invalid date';
    
    try {
        const dateObj = typeof date === 'string' ? parseISO(date) : date;
        return isValid(dateObj) ? format(dateObj, formatString) : 'Invalid date';
    } catch {
        return 'Invalid date';
    }
};

/**
 * Formats a date to time string (HH:mm)
 * @param date Date to format
 * @returns Formatted time string or 'Invalid time' if parsing fails
 */
export const formatTime = (date: string | Date | null | undefined): string => {
    return formatDate(date, 'HH:mm') || 'Invalid time';
};

/**
 * Formats a date to include both date and time
 * @param date Date to format
 * @returns Formatted datetime string
 */
export const formatDateTime = (date: string | Date | null | undefined): string => {
    return formatDate(date, 'MMM dd, yyyy HH:mm') || 'Invalid datetime';
};

/**
 * Formats duration from minutes to human readable format
 * @param minutes Duration in minutes
 * @returns Formatted duration string (e.g., "1h 30m", "45m")
 */
export const formatDuration = (minutes: number | null | undefined): string => {
    if (!minutes || minutes <= 0) return '0m';
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours === 0) {
        return `${remainingMinutes}m`;
    }
    
    if (remainingMinutes === 0) {
        return `${hours}h`;
    }
    
    return `${hours}h ${remainingMinutes}m`;
};

/**
 * Gets relative time string (e.g., "2 days ago", "in 3 days")
 * @param date Date to compare with now
 * @returns Relative time string
 */
export const getRelativeTime = (date: string | Date | null | undefined): string => {
    if (!date) return 'Unknown';
    
    try {
        const dateObj = typeof date === 'string' ? parseISO(date) : date;
        if (!isValid(dateObj)) return 'Unknown';
        
        const daysDiff = differenceInDays(new Date(), startOfDay(dateObj));
        
        if (daysDiff === 0) return 'Today';
        if (daysDiff === 1) return 'Yesterday';
        if (daysDiff === -1) return 'Tomorrow';
        if (daysDiff > 0) return `${daysDiff} days ago`;
        return `In ${Math.abs(daysDiff)} days`;
    } catch {
        return 'Unknown';
    }
};

/**
 * Checks if a date is today
 * @param date Date to check
 * @returns True if the date is today
 */
export const isToday = (date: string | Date | null | undefined): boolean => {
    if (!date) return false;
    
    try {
        const dateObj = typeof date === 'string' ? parseISO(date) : date;
        if (!isValid(dateObj)) return false;
        
        return differenceInDays(new Date(), startOfDay(dateObj)) === 0;
    } catch {
        return false;
    }
};