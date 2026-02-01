import { parseISO, startOfDay, endOfDay } from 'date-fns';

/**
 * Utility functions for OData query building and date formatting
 */

/**
 * Converts a date string or Date object to OData-compatible DateTimeOffset format
 * @param date - Date string (YYYY-MM-DD) or Date object
 * @param type - 'start' for start of day, 'end' for end of day
 * @returns ISO 8601 formatted string with timezone
 */
export const formatDateForOData = (date: string | Date, type: 'start' | 'end' = 'start'): string => {
  try {
    let dateObj: Date;

    if (typeof date === 'string') {
      // If it's a date string like '2026-01-31', create it properly in local timezone
      if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        // Parse YYYY-MM-DD and create as local date (not UTC)
        const [year, month, day] = date.split('-').map(Number);
        dateObj = new Date(year, month - 1, day); // month is 0-indexed
      } else if (date.match(/^[A-Za-z]{3} \d{1,2}, \d{4}$/)) {
        // Handle 'Jan 31, 2026' format
        dateObj = new Date(date);
      } else {
        // If it's already an ISO string, parse it
        dateObj = parseISO(date);
      }
    } else {
      dateObj = new Date(date);
    }

    // Get start or end of day in the user's local timezone, then convert to UTC
    const adjustedDate = type === 'start' ? startOfDay(dateObj) : endOfDay(dateObj);

    const result = adjustedDate.toISOString();

    return result;
  } catch (error) {
    console.error('Error formatting date for OData:', error, 'Input:', date);
    throw new Error(`Invalid date format: ${date}`);
  }
};

/**
 * Converts a date string or Date object to end-of-day OData format
 * @param date - Date string (YYYY-MM-DD) or Date object
 * @returns ISO 8601 formatted string at end of day
 */
export const formatEndDateForOData = (date: string | Date): string => {
  return formatDateForOData(date, 'end');
};