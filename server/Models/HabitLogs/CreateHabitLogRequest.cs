using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TasksTrack.Models
{
    public class CreateHabitLogRequest
    {
        [Required(ErrorMessage = "Habit ID is required")]
        public int HabitId { get; set; }

        [Required(ErrorMessage = "Value is required")]
        [Range(0, double.MaxValue, ErrorMessage = "Value must be a positive number")]
        public decimal Value { get; set; }

        [Required(ErrorMessage = "Date is required")]
        [Column(TypeName = "date")]
        public DateOnly Date { get; set; }

        [StringLength(1000, ErrorMessage = "Notes cannot exceed 1000 characters")]
        public string? Notes { get; set; }
    }
}