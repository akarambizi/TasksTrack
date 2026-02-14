using TasksTrack.Models;
using TasksTrack.Repositories;
using TasksTrack.Services;

namespace TasksTrack.Services
{
    public class HabitLogService : IHabitLogService
    {
        private readonly IHabitLogRepository _repository;
        private readonly IHabitRepository _habitRepository;
        private readonly ICurrentUserService _currentUserService;

        public HabitLogService(IHabitLogRepository repository, IHabitRepository habitRepository, ICurrentUserService currentUserService)
        {
            _repository = repository;
            _habitRepository = habitRepository;
            _currentUserService = currentUserService;
        }

        public async Task<IEnumerable<HabitLog>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<HabitLog?> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task AddAsync(HabitLog habitLog)
        {
            var userId = _currentUserService.GetUserId();

            // Validate that the habit exists
            var habit = await _habitRepository.GetByIdAsync(habitLog.HabitId);
            if (habit == null)
                throw new ArgumentException($"Habit with ID {habitLog.HabitId} not found");

            habitLog.CreatedBy = userId;
            habitLog.CreatedDate = DateTimeOffset.UtcNow;

            await _repository.AddAsync(habitLog);
        }

        public async Task DeleteAsync(int id)
        {
            await _repository.DeleteAsync(id);
        }

        public async Task<bool> UpdateAsync(HabitLog habitLog)
        {
            var userId = _currentUserService.GetUserId();

            // Get existing habit log to validate it exists
            var existingLog = await _repository.GetByIdAsync(habitLog.Id);
            if (existingLog == null)
                return false;

            // Update fields
            existingLog.Date = habitLog.Date;
            existingLog.Value = habitLog.Value;
            existingLog.Notes = habitLog.Notes;
            existingLog.UpdatedBy = userId;
            existingLog.UpdatedDate = DateTimeOffset.UtcNow;

            return await _repository.UpdateAsync(existingLog);
        }

        public async Task<IEnumerable<HabitLog>> GetByHabitIdAsync(int habitId)
        {
            return await _repository.GetByHabitIdAsync(habitId);
        }

        public async Task<IEnumerable<HabitLog>> GetByDateAsync(DateOnly date)
        {
            return await _repository.GetByDateAsync(date);
        }

        public async Task<IEnumerable<HabitLog>> GetByDateRangeAsync(DateOnly startDate, DateOnly endDate)
        {
            return await _repository.GetByDateRangeAsync(startDate, endDate);
        }

        public async Task<IEnumerable<HabitLog>> GetByHabitAndDateRangeAsync(int habitId, DateOnly startDate, DateOnly endDate)
        {
            return await _repository.GetByHabitAndDateRangeAsync(habitId, startDate, endDate);
        }

        public async Task<HabitLog?> GetByHabitAndDateAsync(int habitId, DateOnly date)
        {
            return await _repository.GetByHabitAndDateAsync(habitId, date);
        }
    }
}