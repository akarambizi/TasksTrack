using System.ComponentModel.DataAnnotations;

namespace TasksTrack.Models
{
    public class CreateHabitRequest
    {
        [Required(ErrorMessage = "Name is required")]
        [StringLength(200, ErrorMessage = "Name cannot exceed 200 characters")]
        public required string Name { get; set; }

        [StringLength(1000, ErrorMessage = "Description cannot exceed 1000 characters")]
        public string? Description { get; set; }

        [Required(ErrorMessage = "Metric type is required")]
        [StringLength(50, ErrorMessage = "Metric type cannot exceed 50 characters")]
        public required string MetricType { get; set; }

        [StringLength(20, ErrorMessage = "Unit cannot exceed 20 characters")]
        public string? Unit { get; set; }

        public decimal? Target { get; set; }
        public string? TargetFrequency { get; set; }

        [StringLength(100, ErrorMessage = "Category cannot exceed 100 characters")]
        public string? Category { get; set; }

        [StringLength(7, ErrorMessage = "Color cannot exceed 7 characters")]
        public string? Color { get; set; }

        [StringLength(50, ErrorMessage = "Icon cannot exceed 50 characters")]
        public string? Icon { get; set; }
    }
}