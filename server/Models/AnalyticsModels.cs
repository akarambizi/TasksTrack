using System.ComponentModel.DataAnnotations;

namespace TasksTrack.Models
{
    /// <summary>
    /// Response model for analytics data with time period and aggregated metrics
    /// </summary>
    public class AnalyticsResponse
    {
        public string Period { get; set; } = string.Empty;
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
        public int TotalHabitsTracked { get; set; }
        public int TotalSessions { get; set; }
        public decimal TotalMinutes { get; set; }
        public decimal AverageSessionDuration { get; set; }
        public int ActiveDays { get; set; }
        public int TotalDays { get; set; }
        public decimal ActivityRate { get; set; }
        public int LongestStreak { get; set; }
        public int CurrentStreak { get; set; }
        public List<HabitAnalytics> HabitBreakdown { get; set; } = new();
        public List<CategoryAnalytics> CategoryBreakdown { get; set; } = new();
        public List<DailyProgress> DailyProgress { get; set; } = new();
        public GoalProgress GoalProgress { get; set; } = new();
    }

    /// <summary>
    /// Analytics breakdown by individual habit
    /// </summary>
    public class HabitAnalytics
    {
        public int HabitId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public int SessionCount { get; set; }
        public decimal TotalMinutes { get; set; }
        public decimal AverageSessionDuration { get; set; }
        public int CompletedDays { get; set; }
        public decimal CompletionRate { get; set; }
        public int CurrentStreak { get; set; }
        public int LongestStreak { get; set; }
        public string LastActivityDate { get; set; } = string.Empty;
        public int ActivityIntensity { get; set; }
    }

    /// <summary>
    /// Analytics breakdown by category
    /// </summary>
    public class CategoryAnalytics
    {
        public string Category { get; set; } = string.Empty;
        public int HabitCount { get; set; }
        public int TotalSessions { get; set; }
        public decimal TotalMinutes { get; set; }
        public decimal Percentage { get; set; }
        public int CompletedDays { get; set; }
        public decimal CompletionRate { get; set; }
        public decimal AverageSessionDuration { get; set; }
    }

    /// <summary>
    /// Daily progress data for charts
    /// </summary>
    public class DailyProgress
    {
        public DateOnly Date { get; set; }
        public int SessionCount { get; set; }
        public decimal TotalMinutes { get; set; }
        public int HabitsCompleted { get; set; }
        public int ActivityIntensity { get; set; }
        public string Label { get; set; } = string.Empty;
    }

    /// <summary>
    /// Goal progress tracking
    /// </summary>
    public class GoalProgress
    {
        public decimal TargetMinutesPerPeriod { get; set; }
        public decimal ActualMinutes { get; set; }
        public decimal ProgressPercentage { get; set; }
        public int TargetSessionsPerPeriod { get; set; }
        public int ActualSessions { get; set; }
        public bool OnTrack { get; set; }
        public int DaysRemaining { get; set; }
        public decimal RequiredDailyAverage { get; set; }
    }

    /// <summary>
    /// Request model for custom date range analytics
    /// </summary>
    public class CustomAnalyticsRequest
    {
        [Required]
        public string StartDate { get; set; } = string.Empty;
        
        [Required]
        public string EndDate { get; set; } = string.Empty;
        
        public List<int>? HabitIds { get; set; }
        public List<string>? Categories { get; set; }
        public bool IncludeGoalProgress { get; set; } = true;
    }

    /// <summary>
    /// Comparison analytics between two periods
    /// </summary>
    public class ComparisonAnalyticsResponse
    {
        public AnalyticsResponse CurrentPeriod { get; set; } = new();
        public AnalyticsResponse PreviousPeriod { get; set; } = new();
        public ComparisonMetrics Comparison { get; set; } = new();
    }

    /// <summary>
    /// Metrics comparing two time periods
    /// </summary>
    public class ComparisonMetrics
    {
        public decimal SessionsChange { get; set; }
        public decimal MinutesChange { get; set; }
        public decimal ActivityRateChange { get; set; }
        public decimal CompletionRateChange { get; set; }
        public string Trend { get; set; } = string.Empty; // "improving", "declining", "stable"
        public List<HabitComparison> HabitComparisons { get; set; } = new();
    }

    /// <summary>
    /// Habit-specific comparison metrics
    /// </summary>
    public class HabitComparison
    {
        public int HabitId { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal SessionsChange { get; set; }
        public decimal MinutesChange { get; set; }
        public decimal CompletionRateChange { get; set; }
        public string Trend { get; set; } = string.Empty;
    }

    /// <summary>
    /// Export data request model
    /// </summary>
    public class ExportAnalyticsRequest
    {
        [Required]
        public string StartDate { get; set; } = string.Empty;
        
        [Required]
        public string EndDate { get; set; } = string.Empty;
        
        [Required]
        public string Format { get; set; } = string.Empty; // "csv", "json", "pdf"
        
        public List<int>? HabitIds { get; set; }
        public List<string>? Categories { get; set; }
        public bool IncludeDailyBreakdown { get; set; } = true;
        public bool IncludeHabitBreakdown { get; set; } = true;
        public bool IncludeCategoryBreakdown { get; set; } = true;
    }
}