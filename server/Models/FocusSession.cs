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
        public DateTime StartTime { get; set; }

        public DateTime? PauseTime { get; set; }
        public DateTime? ResumeTime { get; set; }
        public DateTime? EndTime { get; set; }

        [Required(ErrorMessage = "Status is required")]
        [StringLength(FocusSessionConstants.MAX_STATUS_LENGTH, ErrorMessage = "Status cannot exceed {1} characters")]
        public required string Status { get; set; } // "active", "paused", "completed", "interrupted"

        public int PlannedDurationMinutes { get; set; } = FocusSessionConstants.DEFAULT_POMODORO_MINUTES; // Default Pomodoro time
        public int? ActualDurationSeconds { get; set; } // Actual time worked
        public int? PausedDurationSeconds { get; set; } // Total time paused

        [StringLength(FocusSessionConstants.MAX_NOTES_LENGTH, ErrorMessage = "Notes cannot exceed {1} characters")]
        public string? Notes { get; set; }

        public DateTime CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public string? UpdatedBy { get; set; }

        // Navigation properties
        [ForeignKey("HabitId")]
        public Habit? Habit { get; set; }
    }
}