namespace TasksTrack.Services
{
    /// <summary>
    /// Service for accessing current authenticated user information.
    /// </summary>
    public interface ICurrentUserService
    {
        /// <summary>
        /// Gets the current authenticated user's ID.
        /// </summary>
        /// <returns>The user ID as a string.</returns>
        /// <exception cref="UnauthorizedAccessException">Thrown when user is not authenticated or ID is not found.</exception>
        string GetUserId();

        /// <summary>
        /// Gets the current authenticated user's email.
        /// </summary>
        /// <returns>The user email, or null if not found.</returns>
        string? GetUserEmail();

        /// <summary>
        /// Gets the current authenticated user's name.
        /// </summary>
        /// <returns>The user name, or null if not found.</returns>
        string? GetUserName();

        /// <summary>
        /// Checks if the current user is authenticated.
        /// </summary>
        /// <returns>True if user is authenticated, false otherwise.</returns>
        bool IsAuthenticated();
    }
}