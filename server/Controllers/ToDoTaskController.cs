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
            var result = await _toDoTaskService.GetAllAsync();

            return Ok(result);
        }

        [HttpGet("api/tasks/{id}")]
        public async Task<ActionResult<ToDoTask?>> GetById(int id)
        {
            var result = await _toDoTaskService.GetByIdAsync(id);

            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpPost("api/tasks")]
        public async Task<ActionResult> Add([FromBody] ToDoTask toDoTask)
        {
            await _toDoTaskService.AddAsync(toDoTask);
            return CreatedAtAction(nameof(GetById), new { id = toDoTask.Id }, toDoTask);
        }

        [HttpPut("api/tasks/{id}")]
        public async Task<ActionResult> Update(int id, [FromBody] ToDoTask toDoTask)
        {
            if (id != toDoTask.Id)
            {
                return BadRequest();
            }

            await _toDoTaskService.UpdateAsync(toDoTask);
            return NoContent();
        }

        [HttpDelete("api/tasks/{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var existing = await _toDoTaskService.GetByIdAsync(id);
            if (existing == null)
            {
                return NotFound();
            }

            await _toDoTaskService.DeleteAsync(id);
            return NoContent();
        }
    }
}