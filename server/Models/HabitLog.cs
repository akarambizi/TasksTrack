using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TasksTrack.Models
{
    public class HabitLog
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Habit ID is required")]
        public int HabitId { get; set; }

        [Required(ErrorMessage = "Value is required")]
        [Range(0, double.MaxValue, ErrorMessage = "Value must be a positive number")]
        public decimal Value { get; set; } // Amount logged (e.g., 30 minutes, 2 miles, 10 reps)

        [Required(ErrorMessage = "Date is required")]
        [Column(TypeName = "date")]
        public DateOnly Date { get; set; } // Date of the log entry (date only, no time)

        [StringLength(1000, ErrorMessage = "Notes cannot exceed 1000 characters")]
        public string? Notes { get; set; }

        public DateTimeOffset CreatedDate { get; set; }
        public DateTimeOffset? UpdatedDate { get; set; }

        [Required(ErrorMessage = "CreatedBy is required")]
        public required string CreatedBy { get; set; }

        public string? UpdatedBy { get; set; }

        // Navigation property
        [ForeignKey("HabitId")]
        public virtual Habit? Habit { get; set; }
    }
}