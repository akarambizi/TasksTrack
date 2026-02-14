using System.ComponentModel.DataAnnotations;

namespace TasksTrack.Models
{
    public class ActivitySummaryResponse
    {
        [Required]
        public DateOnly StartDate { get; set; }

        [Required]
        public DateOnly EndDate { get; set; }

        [Required]
        [Range(0, int.MaxValue)]
        public int TotalDays { get; set; }

        [Required]
        [Range(0, int.MaxValue)]
        public int ActiveDays { get; set; }

        [Required]
        [Range(0, int.MaxValue)]
        public int TotalActivities { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public decimal TotalValue { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public decimal AverageValue { get; set; }

        [Required]
        [Range(0, int.MaxValue)]
        public int LongestStreak { get; set; }

        [Required]
        [Range(0, int.MaxValue)]
        public int CurrentStreak { get; set; }

        public List<CategorySummary> CategoryBreakdown { get; set; } = new();
        public List<HabitSummary> HabitBreakdown { get; set; } = new();
    }

    public class CategorySummary
    {
        [Required]
        [StringLength(100)]
        public required string Category { get; set; }

        [Required]
        [Range(0, int.MaxValue)]
        public int ActivityCount { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public decimal TotalValue { get; set; }

        [Required]
        [Range(0, 100)]
        public double Percentage { get; set; }
    }

    public class HabitSummary
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
        [Range(0, int.MaxValue)]
        public int ActivityCount { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public decimal TotalValue { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public decimal AverageValue { get; set; }

        [Required]
        [Range(0, int.MaxValue)]
        public int LongestStreak { get; set; }

        [Required]
        [Range(0, int.MaxValue)]
        public int CurrentStreak { get; set; }

        [StringLength(100)]
        public string? Category { get; set; }

        [StringLength(7)]
        public string? Color { get; set; }

        [StringLength(50)]
        public string? Icon { get; set; }
    }
}