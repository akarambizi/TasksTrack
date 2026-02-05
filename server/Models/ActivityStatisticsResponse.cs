using System.ComponentModel.DataAnnotations;

namespace TasksTrack.Models
{
    public class ActivityStatisticsResponse
    {
        [Required]
        [Range(0, int.MaxValue)]
        public int TotalDaysTracked { get; set; }

        [Required]
        [Range(0, int.MaxValue)]
        public int TotalActiveDays { get; set; }

        [Required]
        [Range(0, int.MaxValue)]
        public int TotalActivities { get; set; }

        [Required]
        [Range(0, int.MaxValue)]
        public int TotalHabits { get; set; }

        [Required]
        [Range(0, int.MaxValue)]
        public int ActiveHabits { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public decimal TotalValue { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public decimal AverageValue { get; set; }

        [Required]
        [Range(0, 100)]
        public double CompletionRate { get; set; }

        // Current streak across all habits
        [Required]
        [Range(0, int.MaxValue)]
        public int CurrentOverallStreak { get; set; }

        // Longest streak across all habits
        [Required]
        [Range(0, int.MaxValue)]
        public int LongestOverallStreak { get; set; }

        // Most active day of the week (0=Sunday, 6=Saturday)
        [Range(0, 6)]
        public int MostActiveDayOfWeek { get; set; }

        [StringLength(20)]
        public string? MostActiveDayName { get; set; }

        // Best performing habit
        public HabitPerformance? BestPerformingHabit { get; set; }

        public List<MonthlyStatistics> MonthlyStats { get; set; } = new();
        public List<WeeklyStatistics> WeeklyStats { get; set; } = new();
    }

    public class HabitPerformance
    {
        [Required]
        public int HabitId { get; set; }

        [Required]
        [StringLength(200)]
        public required string HabitName { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public decimal TotalValue { get; set; }

        [Required]
        [Range(0, int.MaxValue)]
        public int ActivityCount { get; set; }

        [Required]
        [Range(0, 100)]
        public double CompletionRate { get; set; }
    }

    public class MonthlyStatistics
    {
        [Required]
        public int Year { get; set; }

        [Required]
        [Range(1, 12)]
        public int Month { get; set; }

        [Required]
        [StringLength(20)]
        public required string MonthName { get; set; }

        [Required]
        [Range(0, int.MaxValue)]
        public int ActivityCount { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public decimal TotalValue { get; set; }

        [Required]
        [Range(0, int.MaxValue)]
        public int ActiveDays { get; set; }
    }

    public class WeeklyStatistics
    {
        [Required]
        public DateOnly WeekStartDate { get; set; }

        [Required]
        public DateOnly WeekEndDate { get; set; }

        [Required]
        [Range(0, int.MaxValue)]
        public int ActivityCount { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public decimal TotalValue { get; set; }

        [Required]
        [Range(0, 7)]
        public int ActiveDays { get; set; }
    }
}