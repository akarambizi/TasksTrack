using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TasksTrack.Models
{
    public class FocusSession
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "HabitId is required")]
        public int HabitId { get; set; }

        [Required(ErrorMessage = "CreatedBy is required")]
        public required string CreatedBy { get; set; }

        [Required(ErrorMessage = "StartTime is required")]
        public DateTimeOffset StartTime { get; set; }

        public DateTimeOffset? PauseTime { get; set; }
        public DateTimeOffset? ResumeTime { get; set; }
        public DateTimeOffset? EndTime { get; set; }

        [Required(ErrorMessage = "Status is required")]
        [StringLength(FocusSessionConstants.MAX_STATUS_LENGTH, ErrorMessage = "Status cannot exceed {1} characters")]
        public required string Status { get; set; } // "active", "paused", "completed", "interrupted"

        public int PlannedDurationMinutes { get; set; } = FocusSessionConstants.DEFAULT_POMODORO_MINUTES; // Default Pomodoro time
        public int? ActualDurationSeconds { get; set; } // Actual time worked
        public int? PausedDurationSeconds { get; set; } // Total time paused

        [StringLength(FocusSessionConstants.MAX_NOTES_LENGTH, ErrorMessage = "Notes cannot exceed {1} characters")]
        public string? Notes { get; set; }

        public DateTimeOffset CreatedDate { get; set; }
        public DateTimeOffset? UpdatedDate { get; set; }
        public string? UpdatedBy { get; set; }

        // Navigation properties
        [ForeignKey("HabitId")]
        public Habit? Habit { get; set; }
    }
}