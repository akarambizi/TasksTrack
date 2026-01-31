namespace TasksTrack.Models
{
    public class FocusSessionCompleteRequest
    {
        public int ActualDurationMinutes { get; set; }
        public bool WasCompleted { get; set; }
        public string? Notes { get; set; }
    }
}