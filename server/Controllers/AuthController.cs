using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using TasksTrack.Services;
using TasksTrack.Models;

namespace TasksTrack.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var result = await _authService.RegisterAsync(request);
            if (!result.Success)
            {
                return BadRequest(result.Message);
            }
            return Ok(result);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var result = await _authService.LoginAsync(request);
            if (!result.Success)
            {
                return Unauthorized(result.Message);
            }

            if (string.IsNullOrEmpty(result.Token))
            {
                return Unauthorized("Invalid token");
            }

            // Token will be handled by client in Authorization header

            return Ok(result);
        }

        [HttpPost("logout")]
        [Authorize] // Must be authenticated to logout
        public async Task<IActionResult> Logout([FromBody] RefreshTokenRequest request)
        {
            // Server-side logout - invalidate refresh token in database
            var result = await _authService.LogoutAsync(request.RefreshToken);
            return Ok(result);
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] PasswordResetRequest request)
        {
            var result = await _authService.ResetPasswordAsync(request);
            if (!result.Success)
            {
                return NotFound(result.Message);
            }
            return Ok(result);
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
        {
            var result = await _authService.RefreshTokenAsync(request);
            if (!result.Success)
            {
                return Unauthorized(result.Message);
            }

            // New token will be handled by client in Authorization header

            return Ok(result);
        }
    }
}