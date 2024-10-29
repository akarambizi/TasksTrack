namespace TasksTrack.Services
{
    public interface IAuthService
    {
        string Register();
        string Login();
        string Logout();
        string RequestPasswordReset();
        string ResetPasswordWithToken(int id);
    }
}