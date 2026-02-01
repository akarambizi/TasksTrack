namespace TasksTrack.Models
{
    public class FocusSessionResponse
    {
        public int Id { get; set; }
        public int HabitId { get; set; }
        public DateTimeOffset StartTime { get; set; }
        public DateTimeOffset? EndTime { get; set; }
        public int PlannedDurationMinutes { get; set; }
        public string? Notes { get; set; }
        public string? CreatedBy { get; set; }
        public DateTimeOffset? PauseTime { get; set; }
        public DateTimeOffset? ResumeTime { get; set; }
        public string Status { get; set; } = string.Empty;
        public int ActualDurationSeconds { get; set; }
        public int PausedDurationSeconds { get; set; }
        public DateTimeOffset CreatedDate { get; set; }
        public Habit? Habit { get; set; } // Nested habit object for client compatibility
    }
}