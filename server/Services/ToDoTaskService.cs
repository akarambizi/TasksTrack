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

        public async Task<IEnumerable<ToDoTask>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<ToDoTask?> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task AddAsync(ToDoTask task)
        {
            await _repository.AddAsync(task);
        }

        public async Task<bool> UpdateAsync(ToDoTask task)
        {
            var existing = await _repository.GetByIdAsync(task.Id);
            if (existing == null)
                return false;

            // Update fields
            existing.Title = task.Title;
            existing.Description = task.Description;
            existing.Completed = task.Completed;
            existing.UpdatedDate = DateTime.UtcNow;
            existing.UpdatedBy = task.UpdatedBy;

            await _repository.UpdateAsync(existing);
            return true;
        }

        public async Task DeleteAsync(int id)
        {
            await _repository.DeleteAsync(id);
        }
    }
}