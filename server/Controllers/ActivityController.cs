using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.OData.Query;
using TasksTrack.Models;
using TasksTrack.Services;
using System.ComponentModel.DataAnnotations;

namespace TasksTrack.Controllers
{
    [ApiController]
    [Authorize]
    public class ActivityController : ControllerBase
    {
        private readonly IActivityService _activityService;
        private readonly ICurrentUserService _currentUserService;

        public ActivityController(IActivityService activityService, ICurrentUserService currentUserService)
        {
            _activityService = activityService;
            _currentUserService = currentUserService;
        }

        private string GetUserId() => _currentUserService.GetUserId();

        /// <summary>
        /// Gets activity grid data for a specific date range (typically 1 year for GitHub-style grid)
        /// </summary>
        /// <param name="startDate">Start date for the grid (format: YYYY-MM-DD)</param>
        /// <param name="endDate">End date for the grid (format: YYYY-MM-DD)</param>
        /// <returns>Activity grid data with intensity levels for each day</returns>
        [HttpGet("api/activity/grid")]
        [EnableQuery]
        public async Task<ActionResult<IQueryable<ActivityGridResponse>>> GetActivityGrid(
            [FromQuery, Required] string startDate,
            [FromQuery, Required] string endDate)
        {
            try
            {
                if (!DateOnly.TryParse(startDate, out var parsedStartDate))
                {
                    return BadRequest(new { message = "Invalid start date format. Use YYYY-MM-DD." });
                }

                if (!DateOnly.TryParse(endDate, out var parsedEndDate))
                {
                    return BadRequest(new { message = "Invalid end date format. Use YYYY-MM-DD." });
                }

                if (parsedStartDate > parsedEndDate)
                {
                    return BadRequest(new { message = "Start date must be before or equal to end date." });
                }

                // Limit the date range to prevent performance issues (max 2 years)
                var daysDifference = parsedEndDate.DayNumber - parsedStartDate.DayNumber;
                if (daysDifference > 730)
                {
                    return BadRequest(new { message = "Date range cannot exceed 2 years (730 days)." });
                }

                var userId = GetUserId();
                var result = await _activityService.GetActivityGridAsync(userId, parsedStartDate, parsedEndDate);
                
                return Ok(result.AsQueryable());
            }
            catch (Exception)
            {
                // Log the exception details server-side
                return StatusCode(500, new { message = "An error occurred while retrieving activity grid data." });
            }
        }

        /// <summary>
        /// Gets activity summary for a date range with streak calculations
        /// </summary>
        /// <param name="startDate">Start date for the summary (format: YYYY-MM-DD)</param>
        /// <param name="endDate">End date for the summary (format: YYYY-MM-DD)</param>
        /// <returns>Activity summary with streaks and breakdowns</returns>
        [HttpGet("api/activity/summary")]
        public async Task<ActionResult<ActivitySummaryResponse>> GetActivitySummary(
            [FromQuery, Required] string startDate,
            [FromQuery, Required] string endDate)
        {
            try
            {
                if (!DateOnly.TryParse(startDate, out var parsedStartDate))
                {
                    return BadRequest(new { message = "Invalid start date format. Use YYYY-MM-DD." });
                }

                if (!DateOnly.TryParse(endDate, out var parsedEndDate))
                {
                    return BadRequest(new { message = "Invalid end date format. Use YYYY-MM-DD." });
                }

                if (parsedStartDate > parsedEndDate)
                {
                    return BadRequest(new { message = "Start date must be before or equal to end date." });
                }

                var userId = GetUserId();
                var result = await _activityService.GetActivitySummaryAsync(userId, parsedStartDate, parsedEndDate);
                
                return Ok(result);
            }
            catch (Exception)
            {
                // Log the exception details server-side
                return StatusCode(500, new { message = "An error occurred while retrieving activity summary." });
            }
        }

        /// <summary>
        /// Gets overall activity statistics for the authenticated user
        /// </summary>
        /// <returns>Comprehensive activity statistics including streaks, best performing habits, and trends</returns>
        [HttpGet("api/activity/statistics")]
        public async Task<ActionResult<ActivityStatisticsResponse>> GetActivityStatistics()
        {
            try
            {
                var userId = GetUserId();
                var result = await _activityService.GetActivityStatisticsAsync(userId);
                
                return Ok(result);
            }
            catch (Exception)
            {
                // Log the exception details server-side
                return StatusCode(500, new { message = "An error occurred while retrieving activity statistics." });
            }
        }

        /// <summary>
        /// Gets the current streak for a specific habit
        /// </summary>
        /// <param name="habitId">The ID of the habit to get the streak for</param>
        /// <returns>Current streak count in days</returns>
        [HttpGet("api/activity/streak/current/{habitId:int}")]
        public async Task<ActionResult<int>> GetCurrentStreak(int habitId)
        {
            try
            {
                var userId = GetUserId();
                var streak = await _activityService.GetCurrentStreakAsync(userId, habitId);
                
                return Ok(streak);
            }
            catch (Exception)
            {
                // Log the exception details server-side
                return StatusCode(500, new { message = "An error occurred while calculating current streak." });
            }
        }

        /// <summary>
        /// Gets the longest streak for a specific habit
        /// </summary>
        /// <param name="habitId">The ID of the habit to get the streak for</param>
        /// <returns>Longest streak count in days</returns>
        [HttpGet("api/activity/streak/longest/{habitId:int}")]
        public async Task<ActionResult<int>> GetLongestStreak(int habitId)
        {
            try
            {
                var userId = GetUserId();
                var streak = await _activityService.GetLongestStreakAsync(userId, habitId);
                
                return Ok(streak);
            }
            catch (Exception)
            {
                // Log the exception details server-side
                return StatusCode(500, new { message = "An error occurred while calculating longest streak." });
            }
        }

        /// <summary>
        /// Gets the current overall streak across all habits for the authenticated user
        /// </summary>
        /// <returns>Current overall streak count in days</returns>
        [HttpGet("api/activity/streak/overall/current")]
        public async Task<ActionResult<int>> GetCurrentOverallStreak()
        {
            try
            {
                var userId = GetUserId();
                var streak = await _activityService.GetCurrentOverallStreakAsync(userId);
                
                return Ok(streak);
            }
            catch (Exception)
            {
                // Log the exception details server-side
                return StatusCode(500, new { message = "An error occurred while calculating current overall streak." });
            }
        }

        /// <summary>
        /// Gets the longest overall streak across all habits for the authenticated user
        /// </summary>
        /// <returns>Longest overall streak count in days</returns>
        [HttpGet("api/activity/streak/overall/longest")]
        public async Task<ActionResult<int>> GetLongestOverallStreak()
        {
            try
            {
                var userId = GetUserId();
                var streak = await _activityService.GetLongestOverallStreakAsync(userId);
                
                return Ok(streak);
            }
            catch (Exception)
            {
                // Log the exception details server-side
                return StatusCode(500, new { message = "An error occurred while calculating longest overall streak." });
            }
        }
    }
}