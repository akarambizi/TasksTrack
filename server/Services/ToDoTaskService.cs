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
            throw new NotImplementedException();
        }

        public void Delete(int id)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<ToDoTask> GetAll()
        {
            throw new NotImplementedException();
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