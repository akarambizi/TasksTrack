using System.ComponentModel.DataAnnotations;

namespace TasksTrack.Models
{
    public class FocusSessionStartRequest
    {
        [Required(ErrorMessage = "HabitId is required")]
        [Range(1, int.MaxValue, ErrorMessage = "HabitId must be greater than 0")]
        public int HabitId { get; set; }
        
        [Required(ErrorMessage = "PlannedDurationMinutes is required")]
        [Range(1, 480, ErrorMessage = "Planned duration must be between 1 and 480 minutes")]
        public int PlannedDurationMinutes { get; set; } = FocusSessionConstants.DEFAULT_POMODORO_MINUTES;
    }
}