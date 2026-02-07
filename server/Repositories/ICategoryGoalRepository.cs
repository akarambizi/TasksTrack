using TasksTrack.Models;

namespace TasksTrack.Repositories
{
    public interface ICategoryGoalRepository
    {
        Task<IEnumerable<CategoryGoal>> GetAllAsync();
        Task<IEnumerable<CategoryGoal>> GetByUserIdAsync(string userId);
        Task<IEnumerable<CategoryGoal>> GetActiveByCategoryIdAsync(int categoryId);
        Task<CategoryGoal?> GetByIdAsync(int id);
        Task<CategoryGoal?> GetActiveByCategoryAndUserAsync(int categoryId, string userId);
        Task AddAsync(CategoryGoal categoryGoal);
        Task UpdateAsync(CategoryGoal categoryGoal);
        Task DeleteAsync(int id);
        Task DeactivateAsync(int id, string? updatedBy = null);
        Task<bool> HasActiveGoalAsync(int categoryId, string userId, int? excludeId = null);
    }
}