using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.OData.Query;
using TasksTrack.Models;
using TasksTrack.Services;

namespace TasksTrack.Controllers
{
    [ApiController]
    [Authorize]
    public class FocusController : ControllerBase
    {
        private readonly IFocusSessionService _focusSessionService;

        public FocusController(IFocusSessionService focusSessionService)
        {
            _focusSessionService = focusSessionService;
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

                var result = await _focusSessionService.StartSessionAsync(request);
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
                var result = await _focusSessionService.PauseSessionAsync();
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
                var result = await _focusSessionService.ResumeSessionAsync();
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

                var result = await _focusSessionService.CompleteSessionAsync(request);
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

        [HttpPost("api/focus/cancel")]
        public async Task<ActionResult<FocusSessionResponse>> CancelSession([FromBody] FocusSessionCompleteRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var result = await _focusSessionService.CancelSessionAsync(request);
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
                return StatusCode(500, new { message = "An error occurred while cancelling the focus session." });
            }
        }

        [HttpGet("api/focus/sessions")]
        [EnableQuery]
        [ProducesResponseType(typeof(IQueryable<FocusSessionResponse>), 200)]
        [ProducesResponseType(401)]
        [ProducesResponseType(500)]
        public ActionResult<IQueryable<FocusSessionResponse>> GetSessions()
        {
            try
            {
                var result = _focusSessionService.GetSessions();
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
                var result = await _focusSessionService.GetActiveSessionAsync();

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
        [EnableQuery]
        public async Task<ActionResult<FocusSessionAnalytics>> GetAnalyticsData()
        {
            try
            {
                var result = await _focusSessionService.GetAnalyticsAsync();
                return Ok(result);
            }
            catch (Exception)
            {
                // Log the exception details server-side
                // TODO: Add proper logging
                return StatusCode(500, new { message = "An error occurred while retrieving analytics summary." });
            }
        }
    }
}