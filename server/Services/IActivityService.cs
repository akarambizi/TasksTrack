using TasksTrack.Models;

namespace TasksTrack.Services
{
    public interface IActivityService
    {
        /// <summary>
        /// Gets activity grid data for a specific date range (typically 1 year for GitHub-style grid)
        /// </summary>
        /// <param name="userId">The user ID to get activity for</param>
        /// <param name="startDate">Start date for the grid</param>
        /// <param name="endDate">End date for the grid</param>
        /// <returns>Activity grid data with intensity levels</returns>
        Task<IEnumerable<ActivityGridResponse>> GetActivityGridAsync(string userId, DateOnly startDate, DateOnly endDate);

        /// <summary>
        /// Gets activity summary for a date range with streak calculations
        /// </summary>
        /// <param name="userId">The user ID to get activity for</param>
        /// <param name="startDate">Start date for the summary</param>
        /// <param name="endDate">End date for the summary</param>
        /// <returns>Activity summary with streaks and breakdowns</returns>
        Task<ActivitySummaryResponse> GetActivitySummaryAsync(string userId, DateOnly startDate, DateOnly endDate);

        /// <summary>
        /// Gets overall activity statistics for the user
        /// </summary>
        /// <param name="userId">The user ID to get statistics for</param>
        /// <returns>Comprehensive activity statistics</returns>
        Task<ActivityStatisticsResponse> GetActivityStatisticsAsync(string userId);

        /// <summary>
        /// Calculates the current streak for a specific habit
        /// </summary>
        /// <param name="userId">The user ID</param>
        /// <param name="habitId">The habit ID to calculate streak for</param>
        /// <returns>Current streak count in days</returns>
        Task<int> GetCurrentStreakAsync(string userId, int habitId);

        /// <summary>
        /// Calculates the longest streak for a specific habit
        /// </summary>
        /// <param name="userId">The user ID</param>
        /// <param name="habitId">The habit ID to calculate streak for</param>
        /// <returns>Longest streak count in days</returns>
        Task<int> GetLongestStreakAsync(string userId, int habitId);

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
        /// <param name="userId">The user ID</param>
        /// <returns>Current overall streak count in days</returns>
        Task<int> GetCurrentOverallStreakAsync(string userId);

        /// <summary>
        /// Gets the longest overall streak (across all habits) for a user
        /// </summary>
        /// <param name="userId">The user ID</param>
        /// <returns>Longest overall streak count in days</returns>
        Task<int> GetLongestOverallStreakAsync(string userId);
    }
}