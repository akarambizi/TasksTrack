using System.ComponentModel.DataAnnotations;

namespace TasksTrack.Models
{
    public class Habit
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Name is required")]
        [StringLength(200, ErrorMessage = "Name cannot exceed 200 characters")]
        public required string Name { get; set; }

        [StringLength(1000, ErrorMessage = "Description cannot exceed 1000 characters")]
        public string? Description { get; set; }

        [Required(ErrorMessage = "Metric type is required")]
        [StringLength(50, ErrorMessage = "Metric type cannot exceed 50 characters")]
        public required string MetricType { get; set; } // "minutes", "miles", "reps", "pages", etc.

        [StringLength(20, ErrorMessage = "Unit cannot exceed 20 characters")]
        public string? Unit { get; set; } // Display unit like "min", "mi", "reps", "pages"

        public decimal? Target { get; set; } // Daily/weekly target value
        public string? TargetFrequency { get; set; } // "daily", "weekly"

        [StringLength(100, ErrorMessage = "Category cannot exceed 100 characters")]
        public string? Category { get; set; } // "Health", "Learning", "Creative", etc.

        public bool IsActive { get; set; } = true;
        public DateTimeOffset CreatedDate { get; set; }
        public DateTimeOffset? UpdatedDate { get; set; }

        [Required(ErrorMessage = "CreatedBy is required")]
        public required string CreatedBy { get; set; }

        public string? UpdatedBy { get; set; }

        // Color for UI display
        [StringLength(7, ErrorMessage = "Color cannot exceed 7 characters")]
        public string? Color { get; set; } // Hex color code

        // Icon for UI display
        [StringLength(50, ErrorMessage = "Icon cannot exceed 50 characters")]
        public string? Icon { get; set; }
    }
}