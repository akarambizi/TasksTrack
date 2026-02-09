using TasksTrack.Models;
using TasksTrack.Repositories;
using TasksTrack.Services;

namespace TasksTrack.Services
{
    public class HabitService : IHabitService
    {
        private readonly IHabitRepository _repository;
        private readonly ICurrentUserService _currentUserService;

        public HabitService(IHabitRepository repository, ICurrentUserService currentUserService)
        {
            _repository = repository;
            _currentUserService = currentUserService;
        }

        public async Task<IEnumerable<Habit>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<Habit?> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task AddAsync(Habit habit)
        {
            var userId = _currentUserService.GetUserId();
            habit.CreatedDate = DateTimeOffset.UtcNow;
            habit.CreatedBy = userId;
            habit.IsActive = true;
            await _repository.AddAsync(habit);
        }

        public async Task<bool> UpdateAsync(Habit habit)
        {
            var existing = await _repository.GetByIdAsync(habit.Id);
            if (existing == null)
                return false;

            var userId = _currentUserService.GetUserId();

            // Update fields
            existing.Name = habit.Name;
            existing.Description = habit.Description;
            existing.MetricType = habit.MetricType;
            existing.Unit = habit.Unit;
            existing.Target = habit.Target;
            existing.TargetFrequency = habit.TargetFrequency;
            existing.Category = habit.Category;
            existing.IsActive = habit.IsActive;
            existing.Color = habit.Color;
            existing.Icon = habit.Icon;
            existing.UpdatedDate = DateTimeOffset.UtcNow;
            existing.UpdatedBy = userId;

            await _repository.UpdateAsync(existing);
            return true;
        }

        public async Task DeleteAsync(int id)
        {
            await _repository.DeleteAsync(id);
        }

        public async Task<IEnumerable<Habit>> GetActiveAsync()
        {
            return await _repository.GetActiveAsync();
        }

        public async Task<IEnumerable<Habit>> GetByCategoryAsync(string category)
        {
            return await _repository.GetByCategoryAsync(category);
        }

        public async Task ArchiveAsync(int id)
        {
            var habit = await _repository.GetByIdAsync(id);
            if (habit != null)
            {
                var userId = _currentUserService.GetUserId();
                habit.IsActive = false;
                habit.UpdatedDate = DateTimeOffset.UtcNow;
                habit.UpdatedBy = userId;
                await _repository.UpdateAsync(habit);
            }
        }

        public async Task ActivateAsync(int id)
        {
            var habit = await _repository.GetByIdAsync(id);
            if (habit != null)
            {
                var userId = _currentUserService.GetUserId();
                habit.IsActive = true;
                habit.UpdatedDate = DateTimeOffset.UtcNow;
                habit.UpdatedBy = userId;
                await _repository.UpdateAsync(habit);
            }
        }
    }
}