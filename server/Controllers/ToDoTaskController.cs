using Microsoft.AspNetCore.Mvc;
using TasksTrack.Models;
using TasksTrack.Services;

namespace TasksTrack.Controllers
{
    public class ToDoTaskController : ControllerBase
    {
        private readonly IToDoTaskService _toDoTaskService;

        // public ToDoTaskController(IToDoTaskService toDoTaskService)
        // {
        //     _toDoTaskService = toDoTaskService;
        // }

        [HttpGet("api/tasks")]
        public IEnumerable<ToDoTask> GetAll()
        {
            return new List<ToDoTask>
                    {
                        new ToDoTask { Id = 1, Title = "Task 1", Completed = false, CreatedBy = "User1", CreatedDate = "2021-01-01", Description = "Task 1 description"},
                        new ToDoTask { Id = 2, Title = "Task 2", Completed = true, CreatedBy = "User2", CreatedDate = "2021-01-01" }
                    };
        }

        [HttpGet("api/tasks/{id}")]
        public ToDoTask GetById(int id)
        {
            return new ToDoTask { Id = id, Title = $"Task {id}", Completed = false, CreatedBy = "User1", CreatedDate = "2021-01-01", Description = "Task 1 description" };
        }

        [HttpPost("api/tasks")]
        public void Add([FromBody] ToDoTask toDoTask)
        {
            return;
        }

        [HttpPut("api/tasks/{id}")]
        public void Update([FromBody] ToDoTask toDoTask)
        {
            return;
        }

        [HttpDelete("api/tasks/{id}")]
        public void Delete(int id)
        {
            return;
        }
    }
}