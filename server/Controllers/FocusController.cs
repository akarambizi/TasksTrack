using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using TasksTrack.Models;
using TasksTrack.Services;
using System.Security.Claims;

namespace TasksTrack.Controllers
{
    [ApiController]
    [Authorize] // Require authentication for all focus session operations
    public class FocusController : ControllerBase
    {
        private readonly IFocusSessionService _focusSessionService;

        public FocusController(IFocusSessionService focusSessionService)
        {
            _focusSessionService = focusSessionService;
        }

        private string GetUserId()
        {
            return User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? 
                throw new UnauthorizedAccessException("User ID not found in token claims.");
        }

        [HttpPost("api/focus/start")]
        public async Task<ActionResult<FocusSessionResponse>> StartSession([FromBody] FocusSessionStartRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var userId = GetUserId();
                var result = await _focusSessionService.StartSessionAsync(request, userId);
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(403, new { message = ex.Message });
            }
            catch (Exception)
            {
                // Log the exception details server-side
                // TODO: Add proper logging
                return StatusCode(500, new { message = "An error occurred while starting the focus session." });
            }
        }

        [HttpPost("api/focus/pause")]
        public async Task<ActionResult<FocusSessionResponse>> PauseSession()
        {
            try
            {
                var userId = GetUserId();
                var result = await _focusSessionService.PauseSessionAsync(userId);
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
            catch (Exception)
            {
                // Log the exception details server-side
                // TODO: Add proper logging
                return StatusCode(500, new { message = "An error occurred while pausing the focus session." });
            }
        }

        [HttpPost("api/focus/resume")]
        public async Task<ActionResult<FocusSessionResponse>> ResumeSession()
        {
            try
            {
                var userId = GetUserId();
                var result = await _focusSessionService.ResumeSessionAsync(userId);
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
            catch (Exception)
            {
                // Log the exception details server-side
                // TODO: Add proper logging
                return StatusCode(500, new { message = "An error occurred while resuming the focus session." });
            }
        }

        [HttpPost("api/focus/complete")]
        public async Task<ActionResult<FocusSessionResponse>> CompleteSession([FromBody] FocusSessionCompleteRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var userId = GetUserId();
                var result = await _focusSessionService.CompleteSessionAsync(request, userId);
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
            catch (Exception)
            {
                // Log the exception details server-side
                // TODO: Add proper logging
                return StatusCode(500, new { message = "An error occurred while completing the focus session." });
            }
        }

        [HttpGet("api/focus/sessions")]
        public async Task<ActionResult<IEnumerable<FocusSessionResponse>>> GetSessions()
        {
            try
            {
                var userId = GetUserId();
                var result = await _focusSessionService.GetSessionsAsync(userId);
                return Ok(result);
            }
            catch (Exception)
            {
                // Log the exception details server-side
                // TODO: Add proper logging
                return StatusCode(500, new { message = "An error occurred while retrieving focus sessions." });
            }
        }

        [HttpGet("api/focus/active")]
        public async Task<ActionResult<FocusSessionResponse?>> GetActiveSession()
        {
            try
            {
                var userId = GetUserId();
                var result = await _focusSessionService.GetActiveSessionAsync(userId);
                
                if (result == null)
                {
                    return NoContent(); // No active session
                }
                
                return Ok(result);
            }
            catch (Exception)
            {
                // Log the exception details server-side
                // TODO: Add proper logging
                return StatusCode(500, new { message = "An error occurred while retrieving the active focus session." });
            }
        }

        [HttpGet("api/focus/analytics")]
        public async Task<ActionResult<FocusSessionAnalytics>> GetAnalytics([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            try
            {
                var userId = GetUserId();
                var result = await _focusSessionService.GetAnalyticsAsync(userId, startDate, endDate);
                return Ok(result);
            }
            catch (Exception)
            {
                // Log the exception details server-side
                // TODO: Add proper logging
                return StatusCode(500, new { message = "An error occurred while retrieving focus session analytics." });
            }
        }
    }
}