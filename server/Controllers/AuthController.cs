using Microsoft.AspNetCore.Mvc;
using TasksTrack.Services;
using System.Collections.Generic;

namespace TasksTrack.Controllers
{
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _service;

        public AuthController(AuthService service)
        {
            _service = service;
        }

        [HttpGet("api/register")]
        public ActionResult<IEnumerable<string>> Register()
        {
            var result = _service.Register();
            return Ok(result);
        }

        [HttpGet("api/login")]
        public ActionResult<string> Login()
        {
            var result = _service.Login();
            return Ok(result);
        }

        [HttpPost("api/logout")]
        public ActionResult<string> Logout()
        {
            var result = _service.Logout();
            return Ok(result);
        }

        [HttpPut("api/request-password-reset")]
        public ActionResult<string> RequestPasswordReset()
        {
            var result = _service.RequestPasswordReset();
            return Ok(result);
        }

        [HttpDelete("reset-password-with-token")]
        public ActionResult<string> ResetPasswordWithToken(int id)
        {
            var result = _service.ResetPasswordWithToken(id);
            return Ok(result);
        }
    }
}