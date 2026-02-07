using TasksTrack.Models;
using TasksTrack.Data;
using Microsoft.EntityFrameworkCore;

namespace TasksTrack.Repositories
{
    public class CategoryGoalRepository : ICategoryGoalRepository
    {
        private readonly TasksTrackContext _context;

        public CategoryGoalRepository(TasksTrackContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<CategoryGoal>> GetAllAsync()
        {
            return await _context.CategoryGoals
                .Include(cg => cg.Category)
                .OrderByDescending(cg => cg.CreatedDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<CategoryGoal>> GetByUserIdAsync(string userId)
        {
            return await _context.CategoryGoals
                .Include(cg => cg.Category)
                .Where(cg => cg.UserId == userId)
                .OrderByDescending(cg => cg.CreatedDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<CategoryGoal>> GetActiveByCategoryIdAsync(int categoryId, string userId)
        {
            return await _context.CategoryGoals
                .Include(cg => cg.Category)
                .Where(cg => cg.CategoryId == categoryId && cg.UserId == userId && cg.IsActive)
                .OrderByDescending(cg => cg.CreatedDate)
                .ToListAsync();
        }

        public async Task<CategoryGoal?> GetByIdAsync(int id)
        {
            return await _context.CategoryGoals
                .Include(cg => cg.Category)
                .FirstOrDefaultAsync(cg => cg.Id == id);
        }

        public async Task<CategoryGoal?> GetActiveByCategoryAndUserAsync(int categoryId, string userId)
        {
            return await _context.CategoryGoals
                .Include(cg => cg.Category)
                .FirstOrDefaultAsync(cg => cg.CategoryId == categoryId
                                         && cg.UserId == userId
                                         && cg.IsActive);
        }

        public async Task AddAsync(CategoryGoal categoryGoal)
        {
            await _context.CategoryGoals.AddAsync(categoryGoal);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(CategoryGoal categoryGoal)
        {
            _context.CategoryGoals.Update(categoryGoal);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var categoryGoal = await _context.CategoryGoals.FindAsync(id);
            if (categoryGoal != null)
            {
                _context.CategoryGoals.Remove(categoryGoal);
                await _context.SaveChangesAsync();
            }
        }

        public async Task DeactivateAsync(int id, string? updatedBy = null)
        {
            var categoryGoal = await _context.CategoryGoals.FindAsync(id);
            if (categoryGoal != null)
            {
                categoryGoal.IsActive = false;
                categoryGoal.UpdatedDate = DateTimeOffset.UtcNow;
                categoryGoal.UpdatedBy = updatedBy;
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> HasActiveGoalAsync(int categoryId, string userId, int? excludeId = null)
        {
            var query = _context.CategoryGoals.Where(cg => cg.CategoryId == categoryId
                                                         && cg.UserId == userId
                                                         && cg.IsActive);
            if (excludeId.HasValue)
            {
                query = query.Where(cg => cg.Id != excludeId.Value);
            }
            return await query.AnyAsync();
        }
    }
}