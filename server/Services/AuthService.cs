using TasksTrack.Repositories;

namespace TasksTrack.Services
{
    public class AuthService : IAuthService
    {
        private readonly IAuthRepository _repository;

        public AuthService(IAuthRepository repository)
        {
            _repository = repository;
        }

        public string Register()
        {
            return "Register logic";
        }

        public string Login()
        {
            return "Login logic";
        }

        public string Logout()
        {
            return "Logout logic";
        }

        public string RequestPasswordReset()
        {
            return "RequestPasswordReset logic";
        }

        public string ResetPasswordWithToken(int id)
        {
            return "ResetPasswordWithToken logic";
        }
    }
}