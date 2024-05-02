using Microsoft.AspNetCore.Mvc;
using TasksTrack.Services;
using System.Collections.Generic;

namespace TasksTrack.Controllers
{
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _service;

        public UsersController(IUserService service)
        {
            _service = service;
        }

        [HttpGet("api/users")]
        public ActionResult<IEnumerable<string>> GetUsers()
        {
            var users = new List<string> { "User1", "User2", "User3" };
            return Ok(users);
        }

        [HttpGet("api/users/{id}")]
        public ActionResult<string> GetUser(int id)
        {
            var user = "User" + id;
            return Ok(user);
        }

        [HttpPost("api/users")]
        public ActionResult<string> AddUser()
        {
            var user = "New User";
            return Ok(user);
        }

        [HttpPut("api/users/{id}")]
        public ActionResult<string> UpdateUser(int id)
        {
            var user = "Updated User" + id;
            return Ok(user);
        }

        [HttpDelete("api/users/{id}")]
        public ActionResult<string> DeleteUser(int id)
        {
            return Ok("api/user deleted");
        }
    }
}