using TasksTrack.Models;

namespace TasksTrack.Services
{
    public interface IToDoTaskService
    {
        Task<IEnumerable<ToDoTask>> GetAllAsync();
        Task<ToDoTask?> GetByIdAsync(int id);
        Task AddAsync(ToDoTask task);
        Task<bool> UpdateAsync(ToDoTask task);
        Task DeleteAsync(int id);
    }
}