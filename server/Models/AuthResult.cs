namespace TasksTrack.Models
{
    public class AuthResult
    {
        public bool Success { get; set; }
        public string? Message { get; set; } = string.Empty;
        public string? Token { get; set; } = string.Empty;
        public string? RefreshToken { get; set; } = string.Empty;
        public DateTimeOffset? TokenExpiry { get; set; }
        public DateTimeOffset? RefreshTokenExpiry { get; set; }
        public string? UserId { get; set; }
        public string? UserEmail { get; set; }
    }
}