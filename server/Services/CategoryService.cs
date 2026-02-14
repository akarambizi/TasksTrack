using TasksTrack.Models;
using TasksTrack.Repositories;
using TasksTrack.Services;

namespace TasksTrack.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _repository;
        private readonly ICurrentUserService _currentUserService;

        public CategoryService(ICategoryRepository repository, ICurrentUserService currentUserService)
        {
            _repository = repository;
            _currentUserService = currentUserService;
        }

        public async Task<IEnumerable<Category>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<IEnumerable<Category>> GetActiveAsync()
        {
            return await _repository.GetActiveAsync();
        }

        public async Task<IEnumerable<Category>> GetParentCategoriesAsync()
        {
            return await _repository.GetParentCategoriesAsync();
        }

        public async Task<IEnumerable<Category>> GetSubCategoriesAsync(int parentId)
        {
            return await _repository.GetSubCategoriesAsync(parentId);
        }

        public async Task<Category?> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<Category?> GetByNameAsync(string name)
        {
            return await _repository.GetByNameAsync(name);
        }

        public async Task AddAsync(Category category)
        {
            var userId = _currentUserService.GetUserId();

            if (string.IsNullOrWhiteSpace(category.Name))
            {
                throw new ArgumentException("Name is required.");
            }

            // Validate category name uniqueness for this user
            if (await _repository.ExistsAsync(category.Name))
            {
                throw new InvalidOperationException($"Category with name '{category.Name}' already exists.");
            }

            // Validate parent category exists if ParentId is specified
            if (category.ParentId.HasValue)
            {
                var parentCategory = await _repository.GetByIdAsync(category.ParentId.Value);
                if (parentCategory == null)
                {
                    throw new InvalidOperationException($"Parent category with ID '{category.ParentId}' does not exist.");
                }

                // Ensure parent is not a subcategory itself (only one level of nesting)
                if (parentCategory.ParentId.HasValue)
                {
                    throw new InvalidOperationException("Cannot create a subcategory under another subcategory. Only one level of nesting is allowed.");
                }
            }

            category.CreatedBy = userId;
            category.CreatedDate = DateTimeOffset.UtcNow;
            category.IsActive = true;
            await _repository.AddAsync(category);
        }

        public async Task<bool> UpdateAsync(Category category)
        {
            var userId = _currentUserService.GetUserId();
            var existingCategory = await _repository.GetByIdAsync(category.Id);
            if (existingCategory == null)
            {
                return false;
            }

            // Validate category name uniqueness for this user
            if (await _repository.ExistsAsync(category.Name, category.Id))
            {
                throw new InvalidOperationException($"Category with name '{category.Name}' already exists.");
            }

            // Validate parent category logic
            if (category.ParentId.HasValue)
            {
                // Cannot set self as parent
                if (category.ParentId == category.Id)
                {
                    throw new InvalidOperationException("A category cannot be its own parent.");
                }

                // Validate parent category exists
                var parentCategory = await _repository.GetByIdAsync(category.ParentId.Value);
                if (parentCategory == null)
                {
                    throw new InvalidOperationException($"Parent category with ID '{category.ParentId}' does not exist.");
                }

                // Ensure parent is not a subcategory itself (only one level of nesting)
                if (parentCategory.ParentId.HasValue)
                {
                    throw new InvalidOperationException("Cannot move category under a subcategory. Only one level of nesting is allowed.");
                }
            }

            existingCategory.Name = category.Name;
            existingCategory.Description = category.Description;
            existingCategory.Color = category.Color;
            existingCategory.Icon = category.Icon;
            existingCategory.ParentId = category.ParentId;
            existingCategory.IsActive = category.IsActive;
            existingCategory.UpdatedDate = DateTimeOffset.UtcNow;
            existingCategory.UpdatedBy = userId;

            await _repository.UpdateAsync(existingCategory);
            return true;
        }

        public async Task DeleteAsync(int id)
        {
            await _repository.DeleteAsync(id);
        }

        public async Task ArchiveAsync(int id)
        {
            var category = await _repository.GetByIdAsync(id);
            if (category != null)
            {
                category.IsActive = false;
                category.UpdatedDate = DateTimeOffset.UtcNow;
                var userId = _currentUserService.GetUserId();
                category.UpdatedBy = userId;
                await _repository.UpdateAsync(category);
            }
        }

        public async Task ActivateAsync(int id)
        {
            var category = await _repository.GetByIdAsync(id);
            if (category != null)
            {
                category.IsActive = true;
                category.UpdatedDate = DateTimeOffset.UtcNow;
                var userId = _currentUserService.GetUserId();
                category.UpdatedBy = userId;
                await _repository.UpdateAsync(category);
            }
        }

        public async Task<bool> ExistsAsync(string name, int? excludeId = null)
        {
            return await _repository.ExistsAsync(name, excludeId);
        }
    }
}