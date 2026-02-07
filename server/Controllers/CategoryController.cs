using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using TasksTrack.Models;
using TasksTrack.Services;

namespace TasksTrack.Controllers
{
    [ApiController]
    [Authorize]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;
        private readonly ICurrentUserService _currentUserService;

        public CategoryController(ICategoryService categoryService, ICurrentUserService currentUserService)
        {
            _categoryService = categoryService;
            _currentUserService = currentUserService;
        }

        private string GetUserId() => _currentUserService.GetUserId();

        [HttpGet("api/categories")]
        public async Task<ActionResult<IEnumerable<Category>>> GetAll()
        {
            try
            {
                var result = await _categoryService.GetAllAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving categories.", error = ex.Message });
            }
        }

        [HttpGet("api/categories/active")]
        public async Task<ActionResult<IEnumerable<Category>>> GetActive()
        {
            try
            {
                var result = await _categoryService.GetActiveAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving active categories.", error = ex.Message });
            }
        }

        [HttpGet("api/categories/parents")]
        public async Task<ActionResult<IEnumerable<Category>>> GetParentCategories()
        {
            try
            {
                var result = await _categoryService.GetParentCategoriesAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving parent categories.", error = ex.Message });
            }
        }

        [HttpGet("api/categories/{parentId}/subcategories")]
        public async Task<ActionResult<IEnumerable<Category>>> GetSubCategories(int parentId)
        {
            try
            {
                var result = await _categoryService.GetSubCategoriesAsync(parentId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving subcategories.", error = ex.Message });
            }
        }

        [HttpGet("api/categories/{id}")]
        public async Task<ActionResult<Category?>> GetById(int id)
        {
            try
            {
                var result = await _categoryService.GetByIdAsync(id);

                if (result == null)
                {
                    return NotFound(new { message = $"Category with ID {id} not found." });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving the category.", error = ex.Message });
            }
        }

        [HttpPost("api/categories")]
        public async Task<ActionResult<Category>> Create([FromBody] Category category)
        {
            try
            {
                var userId = GetUserId();
                category.CreatedBy = userId;

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                await _categoryService.AddAsync(category);
                return CreatedAtAction(nameof(GetById), new { id = category.Id }, category);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating the category.", error = ex.Message });
            }
        }

        [HttpPut("api/categories/{id}")]
        public async Task<ActionResult> Update(int id, [FromBody] Category category)
        {
            try
            {
                if (id != category.Id)
                {
                    return BadRequest(new { message = "Category ID mismatch." });
                }

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var userId = GetUserId();
                category.UpdatedBy = userId;

                var updated = await _categoryService.UpdateAsync(category);
                if (!updated)
                {
                    return NotFound(new { message = $"Category with ID {id} not found." });
                }

                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating the category.", error = ex.Message });
            }
        }

        [HttpDelete("api/categories/{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                var category = await _categoryService.GetByIdAsync(id);
                if (category == null)
                {
                    return NotFound(new { message = $"Category with ID {id} not found." });
                }

                await _categoryService.DeleteAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting the category.", error = ex.Message });
            }
        }

        [HttpPatch("api/categories/{id}/archive")]
        public async Task<ActionResult> Archive(int id)
        {
            try
            {
                var category = await _categoryService.GetByIdAsync(id);
                if (category == null)
                {
                    return NotFound(new { message = $"Category with ID {id} not found." });
                }

                var userId = GetUserId();
                await _categoryService.ArchiveAsync(id, userId);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while archiving the category.", error = ex.Message });
            }
        }

        [HttpPatch("api/categories/{id}/activate")]
        public async Task<ActionResult> Activate(int id)
        {
            try
            {
                var category = await _categoryService.GetByIdAsync(id);
                if (category == null)
                {
                    return NotFound(new { message = $"Category with ID {id} not found." });
                }

                var userId = GetUserId();
                await _categoryService.ActivateAsync(id, userId);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while activating the category.", error = ex.Message });
            }
        }
    }
}