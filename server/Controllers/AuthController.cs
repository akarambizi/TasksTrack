using Microsoft.AspNetCore.Mvc;
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

            // Set the authentication token in a secure, HTTP-only cookie
            if (!string.IsNullOrEmpty(result.Token))
            {
                Response.Cookies.Append("authToken", result.Token, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true, // Set to true in production
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTime.UtcNow.AddHours(1)
                });
            }

            return Ok(new { Message = "Login successful" });
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            // Clear the authentication token cookie
            Response.Cookies.Delete("authToken");
            return Ok(new { Message = "Logout successful" });
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
    }
}