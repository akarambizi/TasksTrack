using TasksTrack.Models;

namespace TasksTrack.Services
{
    public interface IActivityService
    {
        /// <summary>
        /// Gets activity grid data for a specific date range (typically 1 year for GitHub-style grid)
        /// </summary>
        /// <param name="startDate">Start date for the grid</param>
        /// <param name="endDate">End date for the grid</param>
        /// <returns>Activity grid data with intensity levels</returns>
        Task<IEnumerable<ActivityGridResponse>> GetActivityGridAsync(DateOnly startDate, DateOnly endDate);

        /// <summary>
        /// Gets activity summary for a date range with streak calculations
        /// </summary>
        /// <param name="startDate">Start date for the summary</param>
        /// <param name="endDate">End date for the summary</param>
        /// <returns>Activity summary with streaks and breakdowns</returns>
        Task<ActivitySummaryResponse> GetActivitySummaryAsync(DateOnly startDate, DateOnly endDate);

        /// <summary>
        /// Gets overall activity statistics for the user
        /// </summary>
        /// <returns>Comprehensive activity statistics</returns>
        Task<ActivityStatisticsResponse> GetActivityStatisticsAsync();

        /// <summary>
        /// Calculates the current streak for a specific habit
        /// </summary>
        /// <param name="habitId">The habit ID to calculate streak for</param>
        /// <returns>Current streak count in days</returns>
        Task<int> GetCurrentStreakAsync(int habitId);

        /// <summary>
        /// Calculates the longest streak for a specific habit
        /// </summary>
        /// <param name="habitId">The habit ID to calculate streak for</param>
        /// <returns>Longest streak count in days</returns>
        Task<int> GetLongestStreakAsync(int habitId);

        /// <summary>
        /// Gets activity intensity level (0-4) based on activity count and values for a specific date
        /// </summary>
        /// <param name="activityCount">Number of activities on the date</param>
        /// <param name="totalValue">Total value of activities on the date</param>
        /// <param name="userActivityStats">User's overall activity statistics for normalization</param>
        /// <returns>Intensity level from 0 (no activity) to 4 (very high activity)</returns>
        int CalculateActivityIntensity(int activityCount, decimal totalValue, ActivityStatisticsResponse userActivityStats);

        /// <summary>
        /// Gets the current overall streak (across all habits) for a user
        /// </summary>
        /// <returns>Current overall streak count in days</returns>
        Task<int> GetCurrentOverallStreakAsync();

        /// <summary>
        /// Gets the longest overall streak (across all habits) for a user
        /// </summary>

        /// <returns>Longest overall streak count in days</returns>
        Task<int> GetLongestOverallStreakAsync();
    }
}