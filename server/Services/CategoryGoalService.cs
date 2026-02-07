using TasksTrack.Models;
using TasksTrack.Repositories;

namespace TasksTrack.Services
{
    public class CategoryGoalService : ICategoryGoalService
    {
        private readonly ICategoryGoalRepository _repository;

        public CategoryGoalService(ICategoryGoalRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<CategoryGoal>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<IEnumerable<CategoryGoal>> GetByUserIdAsync(string userId)
        {
            return await _repository.GetByUserIdAsync(userId);
        }

        public async Task<IEnumerable<CategoryGoal>> GetActiveByCategoryIdAsync(int categoryId)
        {
            return await _repository.GetActiveByCategoryIdAsync(categoryId);
        }

        public async Task<CategoryGoal?> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<CategoryGoal?> GetActiveByCategoryAndUserAsync(int categoryId, string userId)
        {
            return await _repository.GetActiveByCategoryAndUserAsync(categoryId, userId);
        }

        public async Task AddAsync(CategoryGoal categoryGoal)
        {
            // Validate only one active goal per user per category
            if (await _repository.HasActiveGoalAsync(categoryGoal.CategoryId, categoryGoal.UserId))
            {
                throw new InvalidOperationException("User already has an active goal for this category. Please deactivate the existing goal first.");
            }

            categoryGoal.CreatedDate = DateTimeOffset.UtcNow;
            categoryGoal.StartDate = DateTimeOffset.UtcNow;
            await _repository.AddAsync(categoryGoal);
        }

        public async Task<bool> UpdateAsync(CategoryGoal categoryGoal)
        {
            var existingGoal = await _repository.GetByIdAsync(categoryGoal.Id);
            if (existingGoal == null)
            {
                return false;
            }

            // Validate only one active goal per user per category (excluding current goal)
            if (categoryGoal.IsActive && await _repository.HasActiveGoalAsync(categoryGoal.CategoryId, categoryGoal.UserId, categoryGoal.Id))
            {
                throw new InvalidOperationException("User already has an active goal for this category. Please deactivate the existing goal first.");
            }

            existingGoal.WeeklyTargetMinutes = categoryGoal.WeeklyTargetMinutes;
            existingGoal.WeeklyTargetSessions = categoryGoal.WeeklyTargetSessions;
            existingGoal.DailyTargetMinutes = categoryGoal.DailyTargetMinutes;
            existingGoal.DailyTargetSessions = categoryGoal.DailyTargetSessions;
            existingGoal.IsActive = categoryGoal.IsActive;
            existingGoal.EndDate = categoryGoal.EndDate;
            existingGoal.UpdatedDate = DateTimeOffset.UtcNow;
            existingGoal.UpdatedBy = categoryGoal.UpdatedBy;

            await _repository.UpdateAsync(existingGoal);
            return true;
        }

        public async Task DeleteAsync(int id)
        {
            await _repository.DeleteAsync(id);
        }

        public async Task DeactivateAsync(int id, string? updatedBy = null)
        {
            await _repository.DeactivateAsync(id, updatedBy);
        }

        public async Task<bool> HasActiveGoalAsync(int categoryId, string userId, int? excludeId = null)
        {
            return await _repository.HasActiveGoalAsync(categoryId, userId, excludeId);
        }
    }
}