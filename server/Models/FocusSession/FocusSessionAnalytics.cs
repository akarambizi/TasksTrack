namespace TasksTrack.Models
{
    public class FocusSessionAnalytics
    {
        public int TotalSessions { get; set; }
        public int TotalMinutes { get; set; }
        public int CompletedSessions { get; set; }
        public double AverageSessionMinutes { get; set; }
        public double LongestSessionMinutes { get; set; }
        public int CurrentStreak { get; set; }
        public int LongestStreak { get; set; }
        public double CompletionRate { get; set; }
    }
}