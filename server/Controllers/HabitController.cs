using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using TasksTrack.Models;
using TasksTrack.Services;

namespace TasksTrack.Controllers
{
    [ApiController]
    [Authorize]
    public class HabitController : ControllerBase
    {
        private readonly IHabitService _habitService;

        public HabitController(IHabitService habitService)
        {
            _habitService = habitService;
        }

        [HttpGet("api/habits")]
        public async Task<ActionResult<IEnumerable<Habit>>> GetAll()
        {
            try
            {
                var result = await _habitService.GetAllAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving habits.", error = ex.Message });
            }
        }

        [HttpGet("api/habits/{id}")]
        public async Task<ActionResult<Habit?>> GetById(int id)
        {
            try
            {
                var result = await _habitService.GetByIdAsync(id);

                if (result == null)
                {
                    return NotFound(new { message = $"Habit with ID {id} not found." });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving the habit.", error = ex.Message });
            }
        }

        [HttpPost("api/habits")]
        public async Task<ActionResult> Add([FromBody] Habit habit)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                await _habitService.AddAsync(habit);
                return CreatedAtAction(nameof(GetById), new { id = habit.Id }, habit);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating the habit.", error = ex.Message });
            }
        }

        [HttpPut("api/habits/{id}")]
        public async Task<ActionResult> Update(int id, [FromBody] Habit habit)
        {
            try
            {
                if (id != habit.Id)
                {
                    return BadRequest(new { message = "Habit ID mismatch." });
                }

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var updated = await _habitService.UpdateAsync(habit);

                if (!updated)
                {
                    return NotFound(new { message = $"Habit with ID {id} not found." });
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating the habit.", error = ex.Message });
            }
        }

        [HttpDelete("api/habits/{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {

                var existing = await _habitService.GetByIdAsync(id);
                if (existing == null)
                {
                    return NotFound(new { message = $"Habit with ID {id} not found." });
                }

                await _habitService.DeleteAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting the habit.", error = ex.Message });
            }
        }

        [HttpPost("api/habits/{id}/archive")]
        public async Task<ActionResult> Archive(int id)
        {
            try
            {
                await _habitService.ArchiveAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while archiving the habit.", error = ex.Message });
            }
        }

        [HttpPost("api/habits/{id}/activate")]
        public async Task<ActionResult> Activate(int id)
        {
            try
            {
                await _habitService.ActivateAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while activating the habit.", error = ex.Message });
            }
        }
    }
}