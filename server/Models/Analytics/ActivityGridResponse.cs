using System.ComponentModel.DataAnnotations;

namespace TasksTrack.Models
{
    public class ActivityGridResponse
    {
        [Required]
        public DateOnly Date { get; set; }

        [Required]
        [Range(0, int.MaxValue)]
        public int ActivityCount { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public decimal TotalValue { get; set; }

        [Required]
        [Range(0, 4)]
        public int IntensityLevel { get; set; } // 0-4 for GitHub-style colors

        public List<HabitActivitySummary> HabitsSummary { get; set; } = new();
    }

    public class HabitActivitySummary
    {
        [Required]
        public int HabitId { get; set; }

        [Required]
        [StringLength(200)]
        public required string HabitName { get; set; }

        [Required]
        [StringLength(50)]
        public required string MetricType { get; set; }

        [StringLength(20)]
        public string? Unit { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public decimal Value { get; set; }

        [StringLength(7)]
        public string? Color { get; set; }

        [StringLength(50)]
        public string? Icon { get; set; }
    }
}