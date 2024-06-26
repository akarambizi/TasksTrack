namespace TasksTrack.Models
{
    public class ToDoTask
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public string? Description { get; set; }
        public bool Completed { get; set; }
        public required string CreatedDate { get; set; }
        public string? UpdatedDate { get; set; }
        public required string CreatedBy { get; set; }
        public string? UpdatedBy
        {
            get; set;
        }
    }
}
