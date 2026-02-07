using TasksTrack.Models;

namespace TasksTrack.Services
{
    /// <summary>
    /// Service interface for analytics and dashboard functionality
    /// </summary>
    public interface IAnalyticsService
    {
        /// <summary>
        /// Gets weekly analytics data for the current week
        /// </summary>
        /// <param name="userId">The user ID</param>
        /// <param name="weekOffset">Week offset from current (0 = current week, -1 = last week, etc.)</param>
        /// <returns>Weekly analytics data</returns>
        Task<AnalyticsResponse> GetWeeklyAnalyticsAsync(string userId, int weekOffset = 0);

        /// <summary>
        /// Gets monthly analytics data for the specified month
        /// </summary>
        /// <param name="userId">The user ID</param>
        /// <param name="monthOffset">Month offset from current (0 = current month, -1 = last month, etc.)</param>
        /// <returns>Monthly analytics data</returns>
        Task<AnalyticsResponse> GetMonthlyAnalyticsAsync(string userId, int monthOffset = 0);

        /// <summary>
        /// Gets quarterly analytics data for the specified quarter
        /// </summary>
        /// <param name="userId">The user ID</param>
        /// <param name="quarterOffset">Quarter offset from current (0 = current quarter, -1 = last quarter, etc.)</param>
        /// <returns>Quarterly analytics data</returns>
        Task<AnalyticsResponse> GetQuarterlyAnalyticsAsync(string userId, int quarterOffset = 0);

        /// <summary>
        /// Gets yearly analytics data for the specified year
        /// </summary>
        /// <param name="userId">The user ID</param>
        /// <param name="yearOffset">Year offset from current (0 = current year, -1 = last year, etc.)</param>
        /// <returns>Yearly analytics data</returns>
        Task<AnalyticsResponse> GetYearlyAnalyticsAsync(string userId, int yearOffset = 0);

        /// <summary>
        /// Gets custom date range analytics data
        /// </summary>
        /// <param name="userId">The user ID</param>
        /// <param name="request">Custom analytics request with date range and filters</param>
        /// <returns>Custom analytics data</returns>
        Task<AnalyticsResponse> GetCustomAnalyticsAsync(string userId, CustomAnalyticsRequest request);

        /// <summary>
        /// Gets comparison analytics between two periods
        /// </summary>
        /// <param name="userId">The user ID</param>
        /// <param name="currentStart">Current period start date</param>
        /// <param name="currentEnd">Current period end date</param>
        /// <param name="previousStart">Previous period start date</param>
        /// <param name="previousEnd">Previous period end date</param>
        /// <returns>Comparison analytics data</returns>
        Task<ComparisonAnalyticsResponse> GetComparisonAnalyticsAsync(string userId, 
            DateOnly currentStart, DateOnly currentEnd, 
            DateOnly previousStart, DateOnly previousEnd);

        /// <summary>
        /// Gets habit-to-habit comparison analytics
        /// </summary>
        /// <param name="userId">The user ID</param>
        /// <param name="habitIds">List of habit IDs to compare</param>
        /// <param name="startDate">Start date for comparison</param>
        /// <param name="endDate">End date for comparison</param>
        /// <returns>Habit comparison data</returns>
        Task<List<HabitAnalytics>> GetHabitComparisonAsync(string userId, List<int> habitIds, DateOnly startDate, DateOnly endDate);

        /// <summary>
        /// Exports analytics data in the specified format
        /// </summary>
        /// <param name="userId">The user ID</param>
        /// <param name="request">Export request with format and filters</param>
        /// <returns>Export data as byte array with content type</returns>
        Task<(byte[] Data, string ContentType, string FileName)> ExportAnalyticsAsync(string userId, ExportAnalyticsRequest request);

        /// <summary>
        /// Calculates goal progress for a specific period
        /// </summary>
        /// <param name="userId">The user ID</param>
        /// <param name="startDate">Period start date</param>
        /// <param name="endDate">Period end date</param>
        /// <param name="targetMinutes">Target minutes for the period</param>
        /// <param name="targetSessions">Target sessions for the period</param>
        /// <returns>Goal progress data</returns>
        Task<GoalProgress> CalculateGoalProgressAsync(string userId, DateOnly startDate, DateOnly endDate, 
            decimal? targetMinutes = null, int? targetSessions = null);

        /// <summary>
        /// Gets comprehensive progress tracking for dashboard overview
        /// </summary>
        /// <param name="userId">The user ID</param>
        /// <returns>Dashboard overview data</returns>
        Task<AnalyticsResponse> GetDashboardOverviewAsync(string userId);
    }
}