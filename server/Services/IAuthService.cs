using System.Threading.Tasks;
using TasksTrack.Models;

namespace TasksTrack.Services
{
    public interface IAuthService
    {
        Task<AuthResult> RegisterAsync(RegisterRequest request);
        Task<AuthResult> LoginAsync(LoginRequest request);
        Task<AuthResult> ResetPasswordAsync(PasswordResetRequest request);
        Task<AuthResult> ValidateTokenAsync(TokenRequest request);
    }
}