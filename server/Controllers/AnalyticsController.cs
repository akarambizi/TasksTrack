using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.OData.Query;
using TasksTrack.Models;
using TasksTrack.Services;
using System.ComponentModel.DataAnnotations;

namespace TasksTrack.Controllers
{
    /// <summary>
    /// Controller for analytics and dashboard functionality
    /// </summary>
    [ApiController]
    [Authorize]
    public class AnalyticsController : ControllerBase
    {
        private readonly IAnalyticsService _analyticsService;
        private readonly ICurrentUserService _currentUserService;

        public AnalyticsController(IAnalyticsService analyticsService, ICurrentUserService currentUserService)
        {
            _analyticsService = analyticsService;
            _currentUserService = currentUserService;
        }

        private string GetUserId() => _currentUserService.GetUserId();

        /// <summary>
        /// Gets weekly analytics data for the specified week
        /// </summary>
        /// <param name="weekOffset">Week offset from current (0 = current week, -1 = last week, etc.)</param>
        /// <returns>Weekly analytics data</returns>
        [HttpGet("api/analytics/weekly")]
        public async Task<ActionResult<AnalyticsResponse>> GetWeeklyAnalytics([FromQuery] int weekOffset = 0)
        {
            try
            {
                var userId = GetUserId();
                var result = await _analyticsService.GetWeeklyAnalyticsAsync(userId, weekOffset);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                // Log the exception details server-side
                return StatusCode(500, new { message = "Error retrieving weekly analytics", error = ex.Message });
            }
        }

        /// <summary>
        /// Gets monthly analytics data for the specified month
        /// </summary>
        /// <param name="monthOffset">Month offset from current (0 = current month, -1 = last month, etc.)</param>
        /// <returns>Monthly analytics data</returns>
        [HttpGet("api/analytics/monthly")]
        public async Task<ActionResult<AnalyticsResponse>> GetMonthlyAnalytics([FromQuery] int monthOffset = 0)
        {
            try
            {
                var userId = GetUserId();
                var result = await _analyticsService.GetMonthlyAnalyticsAsync(userId, monthOffset);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                // Log the exception details server-side
                return StatusCode(500, new { message = "Error retrieving monthly analytics", error = ex.Message });
            }
        }

        /// <summary>
        /// Gets quarterly analytics data for the specified quarter
        /// </summary>
        /// <param name="quarterOffset">Quarter offset from current (0 = current quarter, -1 = last quarter, etc.)</param>
        /// <returns>Quarterly analytics data</returns>
        [HttpGet("api/analytics/quarterly")]
        public async Task<ActionResult<AnalyticsResponse>> GetQuarterlyAnalytics([FromQuery] int quarterOffset = 0)
        {
            try
            {
                var userId = GetUserId();
                var result = await _analyticsService.GetQuarterlyAnalyticsAsync(userId, quarterOffset);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                // Log the exception details server-side
                return StatusCode(500, new { message = "Error retrieving quarterly analytics", error = ex.Message });
            }
        }

        /// <summary>
        /// Gets yearly analytics data for the specified year
        /// </summary>
        /// <param name="yearOffset">Year offset from current (0 = current year, -1 = last year, etc.)</param>
        /// <returns>Yearly analytics data</returns>
        [HttpGet("api/analytics/yearly")]
        public async Task<ActionResult<AnalyticsResponse>> GetYearlyAnalytics([FromQuery] int yearOffset = 0)
        {
            try
            {
                var userId = GetUserId();
                var result = await _analyticsService.GetYearlyAnalyticsAsync(userId, yearOffset);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                // Log the exception details server-side
                return StatusCode(500, new { message = "Error retrieving yearly analytics", error = ex.Message });
            }
        }

        /// <summary>
        /// Gets custom date range analytics data with optional filtering
        /// </summary>
        /// <param name="request">Custom analytics request with date range and filters</param>
        /// <returns>Custom analytics data</returns>
        [HttpPost("api/analytics/custom")]
        public async Task<ActionResult<AnalyticsResponse>> GetCustomAnalytics([FromBody] CustomAnalyticsRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var userId = GetUserId();
                var result = await _analyticsService.GetCustomAnalyticsAsync(userId, request);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                // Log the exception details server-side
                return StatusCode(500, new { message = "Error retrieving custom analytics", error = ex.Message });
            }
        }

        /// <summary>
        /// Gets comparison analytics between current and previous periods
        /// </summary>
        /// <param name="currentStart">Current period start date (YYYY-MM-DD)</param>
        /// <param name="currentEnd">Current period end date (YYYY-MM-DD)</param>
        /// <param name="previousStart">Previous period start date (YYYY-MM-DD)</param>
        /// <param name="previousEnd">Previous period end date (YYYY-MM-DD)</param>
        /// <returns>Comparison analytics data</returns>
        [HttpGet("api/analytics/comparison")]
        public async Task<ActionResult<ComparisonAnalyticsResponse>> GetComparisonAnalytics(
            [FromQuery, Required] string currentStart,
            [FromQuery, Required] string currentEnd,
            [FromQuery, Required] string previousStart,
            [FromQuery, Required] string previousEnd)
        {
            try
            {
                if (!DateOnly.TryParse(currentStart, out var parsedCurrentStart))
                {
                    return BadRequest(new { message = "Invalid current start date format. Use YYYY-MM-DD." });
                }

                if (!DateOnly.TryParse(currentEnd, out var parsedCurrentEnd))
                {
                    return BadRequest(new { message = "Invalid current end date format. Use YYYY-MM-DD." });
                }

                if (!DateOnly.TryParse(previousStart, out var parsedPreviousStart))
                {
                    return BadRequest(new { message = "Invalid previous start date format. Use YYYY-MM-DD." });
                }

                if (!DateOnly.TryParse(previousEnd, out var parsedPreviousEnd))
                {
                    return BadRequest(new { message = "Invalid previous end date format. Use YYYY-MM-DD." });
                }

                var userId = GetUserId();
                var result = await _analyticsService.GetComparisonAnalyticsAsync(userId, 
                    parsedCurrentStart, parsedCurrentEnd, parsedPreviousStart, parsedPreviousEnd);
                
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                // Log the exception details server-side
                return StatusCode(500, new { message = "Error retrieving comparison analytics", error = ex.Message });
            }
        }

        /// <summary>
        /// Gets habit comparison analytics for multiple habits
        /// </summary>
        /// <param name="habitIds">Comma-separated list of habit IDs</param>
        /// <param name="startDate">Start date for comparison (YYYY-MM-DD)</param>
        /// <param name="endDate">End date for comparison (YYYY-MM-DD)</param>
        /// <returns>Habit comparison data</returns>
        [HttpGet("api/analytics/habits/comparison")]
        [EnableQuery]
        public async Task<ActionResult<IQueryable<HabitAnalytics>>> GetHabitComparison(
            [FromQuery, Required] string habitIds,
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

                var habitIdList = habitIds.Split(',')
                    .Select(id => int.TryParse(id.Trim(), out var parsed) ? parsed : 0)
                    .Where(id => id > 0)
                    .ToList();

                if (!habitIdList.Any())
                {
                    return BadRequest(new { message = "Please provide valid habit IDs." });
                }

                var userId = GetUserId();
                var result = await _analyticsService.GetHabitComparisonAsync(userId, habitIdList, parsedStartDate, parsedEndDate);
                
                return Ok(result.AsQueryable());
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                // Log the exception details server-side
                return StatusCode(500, new { message = "Error retrieving habit comparison", error = ex.Message });
            }
        }

        /// <summary>
        /// Exports analytics data in the specified format
        /// </summary>
        /// <param name="request">Export request with format and filters</param>
        /// <returns>Analytics data file</returns>
        [HttpPost("api/analytics/export")]
        public async Task<IActionResult> ExportAnalytics([FromBody] ExportAnalyticsRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var userId = GetUserId();
                var (data, contentType, fileName) = await _analyticsService.ExportAnalyticsAsync(userId, request);

                return File(data, contentType, fileName);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                // Log the exception details server-side
                return StatusCode(500, new { message = "Error exporting analytics", error = ex.Message });
            }
        }

        /// <summary>
        /// Gets goal progress for a specific period
        /// </summary>
        /// <param name="startDate">Period start date (YYYY-MM-DD)</param>
        /// <param name="endDate">Period end date (YYYY-MM-DD)</param>
        /// <param name="targetMinutes">Target minutes for the period (optional)</param>
        /// <param name="targetSessions">Target sessions for the period (optional)</param>
        /// <returns>Goal progress data</returns>
        [HttpGet("api/analytics/goal-progress")]
        public async Task<ActionResult<GoalProgress>> GetGoalProgress(
            [FromQuery, Required] string startDate,
            [FromQuery, Required] string endDate,
            [FromQuery] decimal? targetMinutes = null,
            [FromQuery] int? targetSessions = null)
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

                var userId = GetUserId();
                var result = await _analyticsService.CalculateGoalProgressAsync(userId, parsedStartDate, parsedEndDate, targetMinutes, targetSessions);
                
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                // Log the exception details server-side
                return StatusCode(500, new { message = "Error calculating goal progress", error = ex.Message });
            }
        }

        /// <summary>
        /// Gets dashboard overview with key metrics
        /// </summary>
        /// <returns>Dashboard overview data</returns>
        [HttpGet("api/analytics/dashboard")]
        public async Task<ActionResult<AnalyticsResponse>> GetDashboardOverview()
        {
            try
            {
                var userId = GetUserId();
                var result = await _analyticsService.GetDashboardOverviewAsync(userId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                // Log the exception details server-side
                return StatusCode(500, new { message = "Error retrieving dashboard overview", error = ex.Message });
            }
        }
    }
}