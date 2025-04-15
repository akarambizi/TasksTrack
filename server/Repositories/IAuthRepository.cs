using System.Threading.Tasks;
using TasksTrack.Models;

namespace TasksTrack.Repositories
{
    public interface IAuthRepository
    {
        Task<User?> GetUserByEmailAsync(string email);
        Task CreateUserAsync(User user);
        Task UpdateUserAsync(User user);
    }
}