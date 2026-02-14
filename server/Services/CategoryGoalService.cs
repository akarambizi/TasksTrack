using TasksTrack.Models;
using TasksTrack.Repositories;
using TasksTrack.Services;

namespace TasksTrack.Services
{
    public class CategoryGoalService : ICategoryGoalService
    {
        private readonly ICategoryGoalRepository _repository;
        private readonly ICurrentUserService _currentUserService;

        public CategoryGoalService(ICategoryGoalRepository repository, ICurrentUserService currentUserService)
        {
            _repository = repository;
            _currentUserService = currentUserService;
        }

        public async Task<IEnumerable<CategoryGoal>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<IEnumerable<CategoryGoal>> GetByUserIdAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<IEnumerable<CategoryGoal>> GetActiveByCategoryIdAsync(int categoryId)
        {
            return await _repository.GetActiveByCategoryIdAsync(categoryId);
        }

        public async Task<CategoryGoal?> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<CategoryGoal?> GetActiveByCategoryAsync(int categoryId)
        {
            return await _repository.GetActiveByCategoryAsync(categoryId);
        }

        public async Task<CategoryGoal?> GetActiveByCategoryAndUserAsync(int categoryId)
        {
            return await _repository.GetActiveByCategoryAsync(categoryId);
        }

        public async Task AddAsync(CategoryGoal categoryGoal)
        {
            var userId = _currentUserService.GetUserId();

            // Validate only one active goal per user per category
            if (await _repository.HasActiveGoalAsync(categoryGoal.CategoryId))
            {
                throw new InvalidOperationException("User already has an active goal for this category. Please deactivate the existing goal first.");
            }

            categoryGoal.UserId = userId;
            categoryGoal.CreatedDate = DateTimeOffset.UtcNow;
            categoryGoal.StartDate = DateTimeOffset.UtcNow;
            await _repository.AddAsync(categoryGoal);
        }

        public async Task<bool> UpdateAsync(CategoryGoal categoryGoal)
        {
            var userId = _currentUserService.GetUserId();
            var existingGoal = await _repository.GetByIdAsync(categoryGoal.Id);
            if (existingGoal == null)
            {
                return false;
            }

            // Validate only one active goal per user per category (excluding current goal)
            if (categoryGoal.IsActive && await _repository.HasActiveGoalAsync(categoryGoal.CategoryId, categoryGoal.Id))
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
            existingGoal.UpdatedBy = userId;

            await _repository.UpdateAsync(existingGoal);
            return true;
        }

        public async Task DeleteAsync(int id)
        {
            await _repository.DeleteAsync(id);
        }

        public async Task DeactivateAsync(int id)
        {
            var categoryGoal = await _repository.GetByIdAsync(id);
            if (categoryGoal != null)
            {
                var userId = _currentUserService.GetUserId();
                categoryGoal.IsActive = false;
                categoryGoal.UpdatedDate = DateTimeOffset.UtcNow;
                categoryGoal.UpdatedBy = userId;
                await _repository.UpdateAsync(categoryGoal);
            }
        }

        public async Task<bool> HasActiveGoalAsync(int categoryId, int? excludeId = null)
        {
            return await _repository.HasActiveGoalAsync(categoryId, excludeId);
        }
    }
}