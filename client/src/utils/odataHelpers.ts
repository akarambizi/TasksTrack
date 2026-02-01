import { parseISO, startOfDay, endOfDay, isValid } from 'date-fns';

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
  const dateObj = typeof date === 'string' ? parseISO(date) : date;

  if (!isValid(dateObj)) {
    throw new Error(`Invalid date format: ${date}`);
  }

  const adjustedDate = type === 'start' ? startOfDay(dateObj) : endOfDay(dateObj);
  return adjustedDate.toISOString();
};

/**
 * Converts a date string or Date object to end-of-day OData format
 * @param date - Date string (YYYY-MM-DD) or Date object
 * @returns ISO 8601 formatted string at end of day
 */
export const formatEndDateForOData = (date: string | Date): string => {
  return formatDateForOData(date, 'end');
};