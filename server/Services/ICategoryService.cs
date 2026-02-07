using TasksTrack.Models;

namespace TasksTrack.Services
{
    public interface ICategoryService
    {
        Task<IEnumerable<Category>> GetAllAsync();
        Task<IEnumerable<Category>> GetActiveAsync();
        Task<IEnumerable<Category>> GetParentCategoriesAsync();
        Task<IEnumerable<Category>> GetSubCategoriesAsync(int parentId);
        Task<Category?> GetByIdAsync(int id);
        Task<Category?> GetByNameAsync(string name);
        Task AddAsync(Category category);
        Task<bool> UpdateAsync(Category category);
        Task DeleteAsync(int id);
        Task ArchiveAsync(int id, string? updatedBy = null);
        Task ActivateAsync(int id, string? updatedBy = null);
        Task<bool> ExistsAsync(string name, int? excludeId = null);
    }
}