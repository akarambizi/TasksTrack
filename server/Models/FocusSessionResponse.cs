namespace TasksTrack.Models
{
    public class FocusSessionResponse
    {
        public int Id { get; set; }
        public int HabitId { get; set; }
        public string HabitName { get; set; } = string.Empty;
        public DateTime StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public int PlannedDurationMinutes { get; set; }
        public string? Notes { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? PauseTime { get; set; }
        public DateTime? ResumeTime { get; set; }
        public string Status { get; set; } = string.Empty;
        public int ActualDurationSeconds { get; set; }
        public int PausedDurationSeconds { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}