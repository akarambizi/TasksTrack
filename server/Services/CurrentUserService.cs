using System.Security.Claims;

namespace TasksTrack.Services
{
    /// <summary>
    /// Implementation of ICurrentUserService for accessing current authenticated user information.
    /// </summary>
    public class CurrentUserService : ICurrentUserService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CurrentUserService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        /// <summary>
        /// Gets the current authenticated user's ID from JWT token claims.
        /// </summary>
        /// <returns>The user ID as a string.</returns>
        /// <exception cref="UnauthorizedAccessException">Thrown when user is not authenticated or ID is not found.</exception>
        public string GetUserId()
        {
            var user = _httpContextAccessor.HttpContext?.User;

            if (user?.Identity?.IsAuthenticated != true)
            {
                throw new UnauthorizedAccessException("User is not authenticated.");
            }

            var userId = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                throw new UnauthorizedAccessException("User ID not found in token claims.");
            }

            return userId;
        }

        /// <summary>
        /// Gets the current authenticated user's email from JWT token claims.
        /// </summary>
        /// <returns>The user email, or null if not found.</returns>
        public string? GetUserEmail()
        {
            var user = _httpContextAccessor.HttpContext?.User;
            return user?.FindFirst(ClaimTypes.Email)?.Value;
        }

        /// <summary>
        /// Gets the current authenticated user's name from JWT token claims.
        /// </summary>
        /// <returns>The user name, or null if not found.</returns>
        public string? GetUserName()
        {
            var user = _httpContextAccessor.HttpContext?.User;
            return user?.FindFirst(ClaimTypes.Name)?.Value;
        }

        /// <summary>
        /// Checks if the current user is authenticated.
        /// </summary>
        /// <returns>True if user is authenticated, false otherwise.</returns>
        public bool IsAuthenticated()
        {
            var user = _httpContextAccessor.HttpContext?.User;
            return user?.Identity?.IsAuthenticated == true;
        }
    }
}