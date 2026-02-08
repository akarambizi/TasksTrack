import React, { useState, useEffect } from 'react';
import { IActivityGridResponse, IActivityStatisticsResponse } from '@/types';
import { cn } from '../../lib/utils';
import { ChevronDown } from 'lucide-react';
import {
    createWeeksFromActivityData,
    formatActivityTooltipDate,
    createActivityTooltipContent,
    isDateToday,
    getMonthLabelsForWeeks
} from '../../utils/activityGrid.utils';

interface IActivityGridProps {
    data: IActivityGridResponse[];
    statistics?: IActivityStatisticsResponse | null;
    onDateSelect?: (date: string, dayData: IActivityGridResponse) => void;
    className?: string;
    showTitle?: boolean;
    title?: string;
    showYearFilter?: boolean;
    year?: number; // Optional prop for controlled mode
    onYearChange?: (year: number) => void;
}

// Constants for better readability and maintainability
const WEEKDAY_DISPLAY = ['', 'Mon', '', 'Wed', '', 'Fri', ''] as const; // Only show Mon, Wed, Fri like GitHub
const INTENSITY_LEVELS = [0, 1, 2, 3, 4] as const;

// GitHub-style intensity colors - more vibrant and authentic
const intensityColors = {
    0: 'bg-gray-100 dark:bg-gray-900 border-gray-200 dark:border-gray-800', // No activity
    1: 'bg-green-200 dark:bg-green-900 border-green-300 dark:border-green-800', // Low activity
    2: 'bg-green-300 dark:bg-green-700 border-green-400 dark:border-green-600', // Medium activity
    3: 'bg-green-500 dark:bg-green-600 border-green-600 dark:border-green-500', // High activity
    4: 'bg-green-700 dark:bg-green-400 border-green-800 dark:border-green-300', // Very high activity
};

export const ActivityGrid: React.FC<IActivityGridProps> = ({
    data,
    statistics,
    onDateSelect,
    className,
    showTitle = true,
    title,
    showYearFilter = true,
    year, // Controlled year prop
    onYearChange
}) => {
    const [selectedYear, setSelectedYear] = useState(year ?? new Date().getFullYear());
    const [showTooltip, setShowTooltip] = useState<{ x: number; y: number; content: string } | null>(null);

    // Sync external year changes with internal state (controlled mode)
    useEffect(() => {
        if (year !== undefined && year !== selectedYear) {
            setSelectedYear(year);
        }
    }, [year, selectedYear]);

    const weeks = createWeeksFromActivityData(data);
    const monthLabels = getMonthLabelsForWeeks(weeks);

    // Use backend statistics or fallback to basic calculations
    const totalActivities = statistics?.totalActivities ?? data.reduce((sum, day) => sum + day.activityCount, 0);
    const activeDays = statistics?.totalActiveDays ?? data.filter(day => day.activityCount > 0).length;
    const maxStreak = statistics?.longestOverallStreak ?? 0;

    // Generate year options (current year and past 4 years)
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);

    const handleYearChange = (year: number) => {
        setSelectedYear(year);
        onYearChange?.(year);
    };

    const handleMouseEnter = (e: React.MouseEvent, dayData: IActivityGridResponse) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const scrollX = window.scrollX || document.documentElement.scrollLeft;
        const scrollY = window.scrollY || document.documentElement.scrollTop;

        setShowTooltip({
            x: rect.left + scrollX + rect.width / 2,
            y: rect.top + scrollY - 8, // Much closer to the cell
            content: `${formatActivityTooltipDate(dayData.date)}\n${createActivityTooltipContent(dayData)}`
        });
    };

    const handleMouseLeave = () => {
        setShowTooltip(null);
    };

    if (!data.length) {
        return (
            <div className={cn("p-6 text-center text-gray-500", className)}>
                <p>No activity data available</p>
                <p className="text-sm mt-1">Start logging habits to see your activity grid</p>
            </div>
        );
    }

    return (
        <div className={cn("w-full space-y-2", className)}>
            {/* LeetCode-style header with statistics and year filter */}
            {showTitle && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                {title || 'Activity Grid'}
                            </h2>
                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                <span>
                                    <span className="font-medium text-gray-900 dark:text-gray-100">{totalActivities}</span> submissions in the past one year
                                </span>
                            </div>
                        </div>

                        {/* Year Filter Dropdown */}
                        {showYearFilter && (
                            <div className="relative">
                                <select
                                    value={selectedYear}
                                    onChange={(e) => handleYearChange(Number(e.target.value))}
                                    className="appearance-none bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1.5 pr-8 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {yearOptions.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                            </div>
                        )}
                    </div>

                    {/* LeetCode-style statistics */}
                    <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                        <span>Total active days: <span className="font-medium text-gray-900 dark:text-gray-100">{activeDays}</span></span>
                        <span>Max streak: <span className="font-medium text-gray-900 dark:text-gray-100">{maxStreak}</span></span>
                    </div>
                </div>
            )}

            {/* Grid Container */}
            <div className="relative">
                {/* Month labels at the top */}
                <div className="flex mb-2 pl-8"> {/* Added pl-8 to align with grid offset */}
                    {monthLabels.map((month, index) => (
                        <div
                            key={index}
                            className="text-xs text-gray-500 dark:text-gray-400 font-medium"
                            style={{
                                width: `${month.weeks * 14}px`, // 11px cell + 3px gap
                                textAlign: 'left',
                                paddingLeft: month.weeks >= 3 ? '0px' : '4px' // Center short month names
                            }}
                        >
                            {month.label}
                        </div>
                    ))}
                </div>

                {/* Grid with weekday labels on the left */}
                <div className="flex items-start">
                    {/* Weekday labels */}
                    <div className="flex flex-col gap-[3px] w-8 pr-2"> {/* Fixed width and right padding */}
                        {WEEKDAY_DISPLAY.map((day, index) => (
                            <div
                                key={index}
                                className="h-[11px] text-xs text-gray-500 dark:text-gray-400 flex items-center justify-end"
                                style={{ fontSize: '9px' }}
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Activity grid */}
                    <div
                        className="flex gap-[3px]"
                        role="grid"
                        aria-label="Activity grid showing daily habit completion over time"
                    >
                        {weeks.map((week, weekIndex) => (
                            <div key={weekIndex} className="flex flex-col gap-[3px]">
                                {week.map((dayData, dayIndex) => {
                                    const isToday = isDateToday(dayData.date);
                                    const intensityClass = intensityColors[dayData.intensityLevel as keyof typeof intensityColors];

                                    return (
                                        <div
                                            key={`${weekIndex}-${dayIndex}`}
                                            role="gridcell"
                                            tabIndex={0}
                                            aria-label={`${formatActivityTooltipDate(dayData.date)}: ${createActivityTooltipContent(dayData)}`}
                                            className={cn(
                                                "w-[11px] h-[11px] rounded-[2px] cursor-pointer transition-all duration-150 relative",
                                                "hover:ring-1 hover:ring-gray-400 dark:hover:ring-gray-300 hover:ring-offset-1",
                                                intensityClass,
                                                isToday && "ring-2 ring-blue-500 ring-offset-1",
                                                onDateSelect && "hover:scale-110"
                                            )}
                                            onMouseEnter={(e) => handleMouseEnter(e, dayData)}
                                            onMouseLeave={handleMouseLeave}
                                            onClick={() => onDateSelect?.(dayData.date, dayData)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    e.preventDefault();
                                                    onDateSelect?.(dayData.date, dayData);
                                                }
                                            }}
                                        />
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tooltip */}
                {showTooltip && (
                    <div
                        className="fixed z-50 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded px-2 py-1 whitespace-pre-line pointer-events-none shadow-lg border border-gray-600"
                        style={{
                            left: showTooltip.x,
                            top: showTooltip.y,
                            transform: 'translate(-50%, -100%)'
                        }}
                    >
                        {showTooltip.content}
                        {/* Tooltip arrow */}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900 dark:border-t-gray-700"></div>
                    </div>
                )}
            </div>

            {/* Legend - GitHub style with reduced spacing */}
            <div className="flex items-center justify-end space-x-2 text-xs text-gray-500 dark:text-gray-400 mt-2">
                <span>Less</span>
                <div className="flex gap-[3px]">
                    {INTENSITY_LEVELS.map((level) => (
                        <div
                            key={level}
                            className={cn(
                                "w-[11px] h-[11px] rounded-[2px]",
                                intensityColors[level as keyof typeof intensityColors]
                            )}
                        />
                    ))}
                </div>
                <span>More</span>
            </div>
        </div>
    );
};