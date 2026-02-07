using TasksTrack.Models;
using TasksTrack.Repositories;

namespace TasksTrack.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _repository;

        public CategoryService(ICategoryRepository repository)
        {
            _repository = repository;
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
            // Validate required fields
            if (string.IsNullOrWhiteSpace(category.CreatedBy))
            {
                throw new ArgumentException("CreatedBy is required.");
            }

            if (string.IsNullOrWhiteSpace(category.Name))
            {
                throw new ArgumentException("Name is required.");
            }

            // Validate category name uniqueness
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

            category.CreatedDate = DateTimeOffset.UtcNow;
            await _repository.AddAsync(category);
        }

        public async Task<bool> UpdateAsync(Category category)
        {
            var existingCategory = await _repository.GetByIdAsync(category.Id);
            if (existingCategory == null)
            {
                return false;
            }

            // Validate category name uniqueness
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

                // Prevent circular references: check if the parent is currently a subcategory of this category
                if (parentCategory.ParentId.HasValue && parentCategory.ParentId.Value == category.Id)
                {
                    throw new InvalidOperationException("Cannot create circular reference: the parent category is currently a subcategory of this category.");
                }

                // Check if setting this parent would create a direct circular reference
                if (category.ParentId == parentCategory.Id && parentCategory.Id == category.Id)
                {
                    throw new InvalidOperationException("Circular reference detected: Category cannot be its own parent");
                }
            }

            existingCategory.Name = category.Name;
            existingCategory.Description = category.Description;
            existingCategory.Color = category.Color;
            existingCategory.Icon = category.Icon;
            existingCategory.ParentId = category.ParentId;
            existingCategory.IsActive = category.IsActive;
            existingCategory.UpdatedDate = DateTimeOffset.UtcNow;
            existingCategory.UpdatedBy = category.UpdatedBy;

            await _repository.UpdateAsync(existingCategory);
            return true;
        }

        public async Task DeleteAsync(int id)
        {
            await _repository.DeleteAsync(id);
        }

        public async Task ArchiveAsync(int id, string? updatedBy = null)
        {
            var category = await _repository.GetByIdAsync(id);
            if (category != null)
            {
                category.IsActive = false;
                category.UpdatedDate = DateTimeOffset.UtcNow;
                category.UpdatedBy = updatedBy;
                await _repository.UpdateAsync(category);
            }
        }

        public async Task ActivateAsync(int id, string? updatedBy = null)
        {
            var category = await _repository.GetByIdAsync(id);
            if (category != null)
            {
                category.IsActive = true;
                category.UpdatedDate = DateTimeOffset.UtcNow;
                category.UpdatedBy = updatedBy;
                await _repository.UpdateAsync(category);
            }
        }

        public async Task<bool> ExistsAsync(string name, int? excludeId = null)
        {
            return await _repository.ExistsAsync(name, excludeId);
        }
    }
}