using System.ComponentModel.DataAnnotations;

namespace TasksTrack.Models
{
    public class RefreshTokenRequest
    {
        [Required]
        public string RefreshToken { get; set; } = string.Empty;
    }
}