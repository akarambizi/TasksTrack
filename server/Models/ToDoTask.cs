using System.ComponentModel.DataAnnotations;

namespace TasksTrack.Models
{
    public class ToDoTask
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Title is required")]
        [StringLength(200, ErrorMessage = "Title cannot exceed 200 characters")]
        public required string Title { get; set; }

        [StringLength(1000, ErrorMessage = "Description cannot exceed 1000 characters")]
        public string? Description { get; set; }

        public bool Completed { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }

        [Required(ErrorMessage = "CreatedBy is required")]
        public required string CreatedBy { get; set; }

        public string? UpdatedBy { get; set; }
    }
}
