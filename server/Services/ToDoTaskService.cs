using TasksTrack.Models;
using TasksTrack.Repositories;

namespace TasksTrack.Services
{

    public class ToDoTaskService : IToDoTaskService
    {
        private readonly IToDoTaskRepository _repository;

        public ToDoTaskService(IToDoTaskRepository repository)
        {
            _repository = repository;
        }
        public void Add(ToDoTask task)
        {
            _repository.Add(task);
        }

        public void Delete(int id)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<ToDoTask> GetAll()
        {
             return new List<ToDoTask>
                    {
                        new ToDoTask { Id = 1, Title = "Task 1", Completed = false, CreatedBy = "User1", CreatedDate = "2021-01-01", Description = "Task 1 description"},
                        new ToDoTask { Id = 2, Title = "Task 2", Completed = true, CreatedBy = "User2", CreatedDate = "2021-01-01" }
                    };
        }

        public ToDoTask GetById(int id)
        {
            throw new NotImplementedException();
        }

        public void Update(ToDoTask task)
        {
            throw new NotImplementedException();
        }
    }
}