namespace TasksTrack.Models
{
    public class PasswordResetRequest
    {
        public string Email { get; set; }
        public string Token { get; set; }
        public string NewPassword { get; set; }
    }
}