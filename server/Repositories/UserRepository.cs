using TasksTrack.Models;
using TasksTrack.Data;

namespace TasksTrack.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly TasksTrackContext _context;

        public UserRepository(TasksTrackContext context)
        {
            _context = context;
        }

        public void Add(User user)
        {
            throw new NotImplementedException();
        }

        public void Delete(int id)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<User> GetAll()
        {
            throw new NotImplementedException();
        }

        public User GetById(int id)
        {
            throw new NotImplementedException();
        }

        public void Update(User user)
        {
            throw new NotImplementedException();
        }
    }
}