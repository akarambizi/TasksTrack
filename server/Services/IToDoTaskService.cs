using TasksTrack.Models;

namespace TasksTrack.Services
{
    public interface IToDoTaskService
    {
        IEnumerable<ToDoTask> GetAll();
        ToDoTask GetById(int id);
        void Add(ToDoTask task);
        void Update(ToDoTask task);
        void Delete(int id);
    }
}