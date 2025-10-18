using TasksTrack.Models;

namespace TasksTrack.Repositories
{
    public interface IToDoTaskRepository
    {
        Task<IEnumerable<ToDoTask>> GetAllAsync();
        Task<ToDoTask?> GetByIdAsync(int id);
        Task AddAsync(ToDoTask task);
        Task UpdateAsync(ToDoTask task);
        Task DeleteAsync(int id);
    }
}