/**
 * Formats numbers for display with proper pluralization and units
 */

/**
 * Formats a number with proper pluralization
 * @param count Number to format
 * @param singular Singular form of the word
 * @param plural Plural form (defaults to singular + 's')
 * @returns Formatted string with count and proper plural form
 */
export const formatCount = (
    count: number | null | undefined,
    singular: string,
    plural?: string
): string => {
    if (count == null || isNaN(count)) return `0 ${plural || `${singular}s`}`;
    
    const pluralForm = plural || `${singular}s`;
    return `${count} ${count === 1 ? singular : pluralForm}`;
};

/**
 * Formats a number as a percentage
 * @param value Number to format as percentage
 * @param decimals Number of decimal places (default: 1)
 * @returns Formatted percentage string
 */
export const formatPercentage = (
    value: number | null | undefined,
    decimals: number = 1
): string => {
    if (value == null || isNaN(value)) return '0%';
    return `${value.toFixed(decimals)}%`;
};

/**
 * Formats file sizes in human readable format
 * @param bytes Size in bytes
 * @returns Formatted size string (e.g., "1.2 MB", "500 KB")
 */
export const formatFileSize = (bytes: number | null | undefined): string => {
    if (!bytes || bytes === 0) return '0 B';
    
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const size = bytes / Math.pow(1024, i);
    
    return `${size.toFixed(i === 0 ? 0 : 1)} ${sizes[i]}`;
};

/**
 * Formats currency values
 * @param amount Amount to format
 * @param currency Currency code (default: 'USD')
 * @param locale Locale for formatting (default: 'en-US')
 * @returns Formatted currency string
 */
export const formatCurrency = (
    amount: number | null | undefined,
    currency: string = 'USD',
    locale: string = 'en-US'
): string => {
    if (amount == null || isNaN(amount)) return '$0.00';
    
    try {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency,
        }).format(amount);
    } catch {
        return `$${amount.toFixed(2)}`;
    }
};

/**
 * Formats large numbers with appropriate suffixes (K, M, B, T)
 * @param num Number to format
 * @param decimals Number of decimal places (default: 1)
 * @returns Formatted number string with suffix
 */
export const formatLargeNumber = (
    num: number | null | undefined,
    decimals: number = 1
): string => {
    if (num == null || isNaN(num) || num === 0) return '0';
    
    const suffixes = ['', 'K', 'M', 'B', 'T'];
    const tier = Math.floor(Math.log10(Math.abs(num)) / 3);
    
    if (tier <= 0) return num.toString();
    
    const suffix = suffixes[tier] || 'e+' + (tier * 3);
    const scale = Math.pow(10, tier * 3);
    const scaled = num / scale;
    
    return scaled.toFixed(decimals) + suffix;
};

/**
 * Clamps a number between min and max values
 * @param value Number to clamp
 * @param min Minimum value
 * @param max Maximum value
 * @returns Clamped number
 */
export const clamp = (value: number, min: number, max: number): number => {
    return Math.min(Math.max(value, min), max);
};

/**
 * Calculates percentage of value relative to total
 * @param value Current value
 * @param total Total value
 * @returns Percentage (0-100)
 */
export const calculatePercentage = (
    value: number | null | undefined,
    total: number | null | undefined
): number => {
    if (!value || !total || total === 0) return 0;
    return (value / total) * 100;
};