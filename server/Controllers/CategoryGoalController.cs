using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using TasksTrack.Models;
using TasksTrack.Services;

namespace TasksTrack.Controllers
{
    [ApiController]
    [Authorize]
    public class CategoryGoalController : ControllerBase
    {
        private readonly ICategoryGoalService _categoryGoalService;
        private readonly ICurrentUserService _currentUserService;

        public CategoryGoalController(ICategoryGoalService categoryGoalService, ICurrentUserService currentUserService)
        {
            _categoryGoalService = categoryGoalService;
            _currentUserService = currentUserService;
        }

        private string GetUserId() => _currentUserService.GetUserId();

        [HttpGet("api/category-goals")]
        public async Task<ActionResult<IEnumerable<CategoryGoal>>> GetByUser()
        {
            try
            {
                var userId = GetUserId();
                var result = await _categoryGoalService.GetByUserIdAsync(userId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving category goals.", error = ex.Message });
            }
        }

        [HttpGet("api/category-goals/category/{categoryId}")]
        public async Task<ActionResult<IEnumerable<CategoryGoal>>> GetByCategory(int categoryId)
        {
            try
            {
                var userId = GetUserId();
                var result = await _categoryGoalService.GetActiveByCategoryIdAsync(categoryId, userId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving category goals.", error = ex.Message });
            }
        }

        [HttpGet("api/category-goals/{id}")]
        public async Task<ActionResult<CategoryGoal?>> GetById(int id)
        {
            try
            {
                var result = await _categoryGoalService.GetByIdAsync(id);

                if (result == null)
                {
                    return NotFound(new { message = $"Category goal with ID {id} not found." });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving the category goal.", error = ex.Message });
            }
        }

        [HttpGet("api/category-goals/active/category/{categoryId}")]
        public async Task<ActionResult<CategoryGoal?>> GetActiveByCategory(int categoryId)
        {
            try
            {
                var userId = GetUserId();
                var result = await _categoryGoalService.GetActiveByCategoryAndUserAsync(categoryId, userId);

                if (result == null)
                {
                    return NotFound(new { message = $"No active goal found for category {categoryId}." });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving the active category goal.", error = ex.Message });
            }
        }

        [HttpPost("api/category-goals")]
        public async Task<ActionResult<CategoryGoal>> Create([FromBody] CategoryGoal categoryGoal)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var userId = GetUserId();
                categoryGoal.UserId = userId;
                categoryGoal.CreatedBy = userId;

                await _categoryGoalService.AddAsync(categoryGoal);
                return CreatedAtAction(nameof(GetById), new { id = categoryGoal.Id }, categoryGoal);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating the category goal.", error = ex.Message });
            }
        }

        [HttpPut("api/category-goals/{id}")]
        public async Task<ActionResult> Update(int id, [FromBody] CategoryGoal categoryGoal)
        {
            try
            {
                if (id != categoryGoal.Id)
                {
                    return BadRequest(new { message = "Category goal ID mismatch." });
                }

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var userId = GetUserId();
                categoryGoal.UpdatedBy = userId;

                var updated = await _categoryGoalService.UpdateAsync(categoryGoal);
                if (!updated)
                {
                    return NotFound(new { message = $"Category goal with ID {id} not found." });
                }

                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating the category goal.", error = ex.Message });
            }
        }

        [HttpDelete("api/category-goals/{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                var categoryGoal = await _categoryGoalService.GetByIdAsync(id);
                if (categoryGoal == null)
                {
                    return NotFound(new { message = $"Category goal with ID {id} not found." });
                }

                await _categoryGoalService.DeleteAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting the category goal.", error = ex.Message });
            }
        }

        [HttpPatch("api/category-goals/{id}/deactivate")]
        public async Task<ActionResult> Deactivate(int id)
        {
            try
            {
                var categoryGoal = await _categoryGoalService.GetByIdAsync(id);
                if (categoryGoal == null)
                {
                    return NotFound(new { message = $"Category goal with ID {id} not found." });
                }

                var userId = GetUserId();
                await _categoryGoalService.DeactivateAsync(id, userId);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deactivating the category goal.", error = ex.Message });
            }
        }
    }
}