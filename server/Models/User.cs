namespace TasksTrack.Models
{
    public class User
    {
        public int Id { get; set; }
        public required string Email { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }


    }
}