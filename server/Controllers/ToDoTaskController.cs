using Microsoft.AspNetCore.Mvc;
using TasksTrack.Models;
using TasksTrack.Services;

namespace TasksTrack.Controllers
{
    public class ToDoTaskController : ControllerBase
    {
        private readonly IToDoTaskService _toDoTaskService;

        public ToDoTaskController(IToDoTaskService toDoTaskService)
        {
            _toDoTaskService = toDoTaskService;
        }

        [HttpGet("api/tasks")]
        public async Task<ActionResult<IEnumerable<ToDoTask>>> GetAll()
        {
            try
            {
                var result = await _toDoTaskService.GetAllAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving tasks.", error = ex.Message });
            }
        }

        [HttpGet("api/tasks/{id}")]
        public async Task<ActionResult<ToDoTask?>> GetById(int id)
        {
            try
            {
                var result = await _toDoTaskService.GetByIdAsync(id);

                if (result == null)
                {
                    return NotFound(new { message = $"Task with ID {id} not found." });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving the task.", error = ex.Message });
            }
        }

        [HttpPost("api/tasks")]
        public async Task<ActionResult> Add([FromBody] ToDoTask toDoTask)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                await _toDoTaskService.AddAsync(toDoTask);
                return CreatedAtAction(nameof(GetById), new { id = toDoTask.Id }, toDoTask);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating the task.", error = ex.Message });
            }
        }

        [HttpPut("api/tasks/{id}")]
        public async Task<ActionResult> Update(int id, [FromBody] ToDoTask toDoTask)
        {
            try
            {
                if (id != toDoTask.Id)
                {
                    return BadRequest(new { message = "Task ID mismatch." });
                }

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var updated = await _toDoTaskService.UpdateAsync(toDoTask);

                if (!updated)
                {
                    return NotFound(new { message = $"Task with ID {id} not found." });
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating the task.", error = ex.Message });
            }
        }

        [HttpDelete("api/tasks/{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                var existing = await _toDoTaskService.GetByIdAsync(id);
                if (existing == null)
                {
                    return NotFound(new { message = $"Task with ID {id} not found." });
                }

                await _toDoTaskService.DeleteAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting the task.", error = ex.Message });
            }
        }
    }
}