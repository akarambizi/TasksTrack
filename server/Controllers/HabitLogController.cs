using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using TasksTrack.Models;
using TasksTrack.Services;

namespace TasksTrack.Controllers
{
    [ApiController]
    [Authorize] // Require authentication for all habit log operations
    public class HabitLogController : ControllerBase
    {
        private readonly IHabitLogService _habitLogService;

        public HabitLogController(IHabitLogService habitLogService)
        {
            _habitLogService = habitLogService;
        }

        [HttpGet("api/habit-logs")]
        public async Task<ActionResult<IEnumerable<HabitLog>>> GetAll()
        {
            try
            {
                var result = await _habitLogService.GetAllAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving habit logs.", error = ex.Message });
            }
        }

        [HttpGet("api/habit-logs/{id}")]
        public async Task<ActionResult<HabitLog?>> GetById(int id)
        {
            try
            {
                var result = await _habitLogService.GetByIdAsync(id);

                if (result == null)
                {
                    return NotFound(new { message = $"Habit log with ID {id} not found." });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving the habit log.", error = ex.Message });
            }
        }

        [HttpPost("api/habit-logs")]
        public async Task<ActionResult> Add([FromBody] HabitLog habitLog)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                await _habitLogService.AddAsync(habitLog);
                return CreatedAtAction(nameof(GetById), new { id = habitLog.Id }, habitLog);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating the habit log.", error = ex.Message });
            }
        }

        [HttpPut("api/habit-logs/{id}")]
        public async Task<ActionResult> Update(int id, [FromBody] HabitLog habitLog)
        {
            try
            {
                if (id != habitLog.Id)
                {
                    return BadRequest(new { message = "Habit log ID mismatch." });
                }

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var success = await _habitLogService.UpdateAsync(habitLog);
                if (!success)
                {
                    return NotFound(new { message = $"Habit log with ID {id} not found." });
                }

                return NoContent();
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating the habit log.", error = ex.Message });
            }
        }

        [HttpDelete("api/habit-logs/{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                await _habitLogService.DeleteAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting the habit log.", error = ex.Message });
            }
        }

        [HttpGet("api/habit-logs/habit/{habitId}")]
        public async Task<ActionResult<IEnumerable<HabitLog>>> GetByHabitId(int habitId)
        {
            try
            {
                var result = await _habitLogService.GetByHabitIdAsync(habitId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving habit logs.", error = ex.Message });
            }
        }

        [HttpGet("api/habit-logs/date/{date}")]
        public async Task<ActionResult<IEnumerable<HabitLog>>> GetByDate(DateTime date)
        {
            try
            {
                var result = await _habitLogService.GetByDateAsync(date);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving habit logs.", error = ex.Message });
            }
        }

        [HttpGet("api/habit-logs/date-range")]
        public async Task<ActionResult<IEnumerable<HabitLog>>> GetByDateRange([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            try
            {
                var result = await _habitLogService.GetByDateRangeAsync(startDate, endDate);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving habit logs.", error = ex.Message });
            }
        }

        [HttpGet("api/habit-logs/habit/{habitId}/date-range")]
        public async Task<ActionResult<IEnumerable<HabitLog>>> GetByHabitAndDateRange(int habitId, [FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            try
            {
                var result = await _habitLogService.GetByHabitAndDateRangeAsync(habitId, startDate, endDate);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving habit logs.", error = ex.Message });
            }
        }

        [HttpGet("api/habit-logs/habit/{habitId}/date/{date}")]
        public async Task<ActionResult<HabitLog?>> GetByHabitAndDate(int habitId, DateTime date)
        {
            try
            {
                var result = await _habitLogService.GetByHabitAndDateAsync(habitId, date);
                if (result == null)
                {
                    return NotFound(new { message = $"No habit log found for habit {habitId} on {date:yyyy-MM-dd}." });
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving the habit log.", error = ex.Message });
            }
        }
    }
}