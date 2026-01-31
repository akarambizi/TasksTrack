namespace TasksTrack.Models
{
    public class AuthResult
    {
        public bool Success { get; set; }
        public string? Message { get; set; } = string.Empty;
        public string? Token { get; set; } = string.Empty;
        public string? RefreshToken { get; set; } = string.Empty;
        public DateTime? TokenExpiry { get; set; }
        public DateTime? RefreshTokenExpiry { get; set; }
        public string? UserId { get; set; }
        public string? UserEmail { get; set; }
    }
}