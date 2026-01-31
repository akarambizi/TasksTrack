namespace TasksTrack.Models
{
    public class FocusSessionAnalytics
    {
        public int TotalSessions { get; set; }
        public int CompletedSessions { get; set; }
        public double CompletionRate { get; set; }
        public int TotalFocusTimeMinutes { get; set; }
        public double AverageDurationMinutes { get; set; }
    }
}