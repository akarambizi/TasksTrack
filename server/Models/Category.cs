using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace TasksTrack.Models
{
    [Index(nameof(Name), IsUnique = true)]
    public class Category
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Name is required")]
        [StringLength(100, ErrorMessage = "Name cannot exceed 100 characters")]
        public string Name { get; set; } = string.Empty;

        [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters")]
        public string? Description { get; set; }

        [StringLength(7, ErrorMessage = "Color cannot exceed 7 characters")]
        public string? Color { get; set; } // Hex color code

        [StringLength(50, ErrorMessage = "Icon cannot exceed 50 characters")]
        public string? Icon { get; set; } // Icon name for UI

        // Subcategory support - self-referencing foreign key
        [ForeignKey(nameof(Parent))]
        public int? ParentId { get; set; }

        public bool IsActive { get; set; } = true;
        public DateTimeOffset CreatedDate { get; set; }
        public DateTimeOffset? UpdatedDate { get; set; }

        public required string CreatedBy { get; set; }

        public string? UpdatedBy { get; set; }

        // Navigation properties
        public virtual Category? Parent { get; set; }
        public virtual ICollection<Category> SubCategories { get; set; } = new List<Category>();
        public virtual ICollection<CategoryGoal> CategoryGoals { get; set; } = new List<CategoryGoal>();
    }
}