using TasksTrack.Models;

namespace TasksTrack.Services
{
    public interface ICategoryGoalService
    {
        Task<IEnumerable<CategoryGoal>> GetAllAsync();
        Task<IEnumerable<CategoryGoal>> GetByUserIdAsync();
        Task<IEnumerable<CategoryGoal>> GetActiveByCategoryIdAsync(int categoryId);
        Task<CategoryGoal?> GetByIdAsync(int id);
        Task<CategoryGoal?> GetActiveByCategoryAsync(int categoryId);
        Task<CategoryGoal?> GetActiveByCategoryAndUserAsync(int categoryId);
        Task AddAsync(CategoryGoal categoryGoal);
        Task<bool> UpdateAsync(CategoryGoal categoryGoal);
        Task DeleteAsync(int id);
        Task DeactivateAsync(int id);
        Task<bool> HasActiveGoalAsync(int categoryId, int? excludeId = null);
    }
}