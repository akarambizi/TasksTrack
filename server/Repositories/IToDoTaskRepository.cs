using TasksTrack.Models;

namespace TasksTrack.Repositories
{
    public interface IToDoTaskRepository
    {
        IEnumerable<ToDoTask> GetAll();
        ToDoTask GetById(int id);
        void Add(ToDoTask task);
        void Update(ToDoTask task);
        void Delete(int id);
    }
}