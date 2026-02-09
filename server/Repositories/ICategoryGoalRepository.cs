using TasksTrack.Models;

namespace TasksTrack.Repositories
{
    public interface ICategoryGoalRepository
    {
        Task<IEnumerable<CategoryGoal>> GetAllAsync();
        Task<IEnumerable<CategoryGoal>> GetActiveByCategoryIdAsync(int categoryId);
        Task<CategoryGoal?> GetByIdAsync(int id);
        Task<CategoryGoal?> GetActiveByCategoryAsync(int categoryId);
        Task AddAsync(CategoryGoal categoryGoal);
        Task UpdateAsync(CategoryGoal categoryGoal);
        Task DeleteAsync(int id);
        Task DeactivateAsync(int id);
        Task<bool> HasActiveGoalAsync(int categoryId, int? excludeId = null);
    }
}