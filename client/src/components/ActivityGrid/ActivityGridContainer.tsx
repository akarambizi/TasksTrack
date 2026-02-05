import React, { useState } from 'react';
import { format, startOfYear, endOfYear } from 'date-fns';
import { ActivityGrid } from './ActivityGrid';
import { useActivityGrid, useActivityStatistics } from '../../queries/activity';
import { LoadingSkeleton } from '../ui/common/loading-skeleton';
import { Card, CardContent } from '../ui/card';
import { IActivityGridResponse } from '../../api/activity.types';

interface IActivityGridContainerProps {
    /**
     * Custom start and end dates
     */
    startDate?: string;
    endDate?: string;
    /**
     * Callback when a date is clicked
     */
    onDateClick?: (date: string, dayData: IActivityGridResponse) => void;
    /**
     * Additional CSS classes
     */
    className?: string;
    /**
     * Show card wrapper (default: true)
     */
    showCard?: boolean;
    /**
     * Show year filter (default: true)
     */
    showYearFilter?: boolean;
}

export const ActivityGridContainer: React.FC<IActivityGridContainerProps> = ({
    startDate: customStartDate,
    endDate: customEndDate,
    onDateClick,
    className,
    showCard = true,
    showYearFilter = true
}) => {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    
    // Calculate date range based on selected year or custom dates
    const calculateDateRange = () => {
        if (customStartDate && customEndDate) {
            return { startDate: customStartDate, endDate: customEndDate };
        }
        
        // Use selected year for date range
        const yearStart = startOfYear(new Date(selectedYear, 0, 1));
        const yearEnd = endOfYear(new Date(selectedYear, 0, 1));
        
        return {
            startDate: format(yearStart, 'yyyy-MM-dd'),
            endDate: format(yearEnd, 'yyyy-MM-dd')
        };
    };
    
    const { startDate, endDate } = calculateDateRange();

    // Fetch activity data
    const {
        data: activityData,
        isLoading: isLoadingGrid,
        error: gridError
    } = useActivityGrid(startDate, endDate);

    // Fetch activity statistics
    const {
        data: statisticsData,
        isLoading: isLoadingStats,
        error: statsError
    } = useActivityStatistics();

    const isLoading = isLoadingGrid || isLoadingStats;
    const error = gridError || statsError;

    const handleDateClick = (date: string, dayData: IActivityGridResponse) => {
        onDateClick?.(date, dayData);
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="space-y-4">
                    <div className="flex justify-between">
                        <LoadingSkeleton className="h-4 w-20" />
                        <LoadingSkeleton className="h-4 w-20" />
                    </div>
                    <LoadingSkeleton className="h-6 w-full" />
                    <div className="grid grid-cols-53 gap-1">
                        {Array.from({ length: 371 }).map((_, i) => (
                            <LoadingSkeleton key={i} className="w-3 h-3 rounded-sm" />
                        ))}
                    </div>
                    <div className="flex justify-between">
                        <LoadingSkeleton className="h-3 w-10" />
                        <LoadingSkeleton className="h-3 w-20" />
                        <LoadingSkeleton className="h-3 w-10" />
                    </div>
                </div>
            );
        }

        if (error) {
            return (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p>Failed to load activity data</p>
                    <p className="text-sm mt-1">Please try again later</p>
                </div>
            );
        }

        if (!activityData) {
            return (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p>No activity data available</p>
                    <p className="text-sm mt-1">Start logging habits to see your activity grid</p>
                </div>
            );
        }

        return (
            <ActivityGrid
                data={activityData}
                statistics={statisticsData}
                onDateSelect={handleDateClick}
                className="w-full"
                showTitle={true} // Always show statistics
                showYearFilter={showYearFilter}
                onYearChange={setSelectedYear}
            />
        );
    };

    if (!showCard) {
        return <div className={className}>{renderContent()}</div>;
    }

    return (
        <Card className={className}>
            <CardContent className="pt-6">
                {renderContent()}
            </CardContent>
        </Card>
    );
};