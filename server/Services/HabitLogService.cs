using TasksTrack.Models;
using TasksTrack.Repositories;

namespace TasksTrack.Services
{
    public class HabitLogService : IHabitLogService
    {
        private readonly IHabitLogRepository _repository;
        private readonly IHabitRepository _habitRepository;

        public HabitLogService(IHabitLogRepository repository, IHabitRepository habitRepository)
        {
            _repository = repository;
            _habitRepository = habitRepository;
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
            // Validate that the habit exists
            var habit = await _habitRepository.GetByIdAsync(habitLog.HabitId);
            if (habit == null)
                throw new ArgumentException($"Habit with ID {habitLog.HabitId} not found");

            habitLog.CreatedDate = DateTime.UtcNow;
            habitLog.Date = habitLog.Date.Date; // Ensure we store only the date part

            await _repository.AddAsync(habitLog);
        }

        public async Task<bool> UpdateAsync(HabitLog habitLog)
        {
            var existing = await _repository.GetByIdAsync(habitLog.Id);
            if (existing == null)
                return false;

            // Validate that the habit exists if habitId is being changed
            if (existing.HabitId != habitLog.HabitId)
            {
                var habit = await _habitRepository.GetByIdAsync(habitLog.HabitId);
                if (habit == null)
                    throw new ArgumentException($"Habit with ID {habitLog.HabitId} not found");
            }

            // Update fields
            existing.HabitId = habitLog.HabitId;
            existing.Value = habitLog.Value;
            existing.Date = habitLog.Date.Date; // Ensure we store only the date part
            existing.Notes = habitLog.Notes;
            existing.UpdatedDate = DateTime.UtcNow;
            existing.UpdatedBy = habitLog.UpdatedBy;

            await _repository.UpdateAsync(existing);
            return true;
        }

        public async Task DeleteAsync(int id)
        {
            await _repository.DeleteAsync(id);
        }

        public async Task<IEnumerable<HabitLog>> GetByHabitIdAsync(int habitId)
        {
            return await _repository.GetByHabitIdAsync(habitId);
        }

        public async Task<IEnumerable<HabitLog>> GetByDateAsync(DateTime date)
        {
            return await _repository.GetByDateAsync(date);
        }

        public async Task<IEnumerable<HabitLog>> GetByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            return await _repository.GetByDateRangeAsync(startDate, endDate);
        }

        public async Task<IEnumerable<HabitLog>> GetByHabitAndDateRangeAsync(int habitId, DateTime startDate, DateTime endDate)
        {
            return await _repository.GetByHabitAndDateRangeAsync(habitId, startDate, endDate);
        }

        public async Task<HabitLog?> GetByHabitAndDateAsync(int habitId, DateTime date)
        {
            return await _repository.GetByHabitAndDateAsync(habitId, date);
        }
    }
}