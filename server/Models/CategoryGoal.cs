using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace TasksTrack.Models
{
    [Index(nameof(CategoryId), nameof(UserId))]
    public class CategoryGoal
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "CategoryId is required")]
        [ForeignKey(nameof(Category))]
        public int CategoryId { get; set; }

        [Required(ErrorMessage = "UserId is required")]
        [StringLength(255, ErrorMessage = "UserId cannot exceed 255 characters")]
        public required string UserId { get; set; }

        // Weekly Goals
        [Range(0, int.MaxValue, ErrorMessage = "Weekly target minutes must be non-negative")]
        public int? WeeklyTargetMinutes { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Weekly target sessions must be non-negative")]
        public int? WeeklyTargetSessions { get; set; }

        // Daily Goals
        [Range(0, int.MaxValue, ErrorMessage = "Daily target minutes must be non-negative")]
        public int? DailyTargetMinutes { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Daily target sessions must be non-negative")]
        public int? DailyTargetSessions { get; set; }

        // Goal period
        public bool IsActive { get; set; } = true;
        public DateTimeOffset StartDate { get; set; }
        public DateTimeOffset? EndDate { get; set; }

        // Tracking
        public DateTimeOffset CreatedDate { get; set; }
        public DateTimeOffset? UpdatedDate { get; set; }

        [Required(ErrorMessage = "CreatedBy is required")]
        public required string CreatedBy { get; set; }

        public string? UpdatedBy { get; set; }

        // Navigation properties
        public virtual Category Category { get; set; } = null!;
    }
}