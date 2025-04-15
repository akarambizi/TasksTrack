using TasksTrack.Models;
using TasksTrack.Data;

namespace TasksTrack.Repositories
{
    public class ToDoTaskRepository : IToDoTaskRepository
    {
        // private readonly TasksTrackContext _context;

        public ToDoTaskRepository(TasksTrackContext context)
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

        public void Add(ToDoTask task)
        {
            throw new NotImplementedException();
        }

        public void Update(ToDoTask task)
        {
            throw new NotImplementedException();
        }

        public void Delete(int id)
        {
            throw new NotImplementedException();
        }
    }
}