using SocialMediaBackend.Models;
using System.Threading.Tasks;

namespace SocialMediaBackend.Repositories
{
    public interface IUserRepository
    {
        Task<User?> GetUserByIdAsync(int id);
        Task<User?> GetUserByEmailAsync(string email);
        Task<User?> GetUserByUsernameAsync(string username);
        Task<User?> GetUserByEmailVerificationTokenAsync(string token);
        Task CreateUserAsync(User user);
        Task UpdateUserAsync(User user);
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task DeleteUserAsync(User user);
        Task<IEnumerable<LoginHistory>> GetUserLoginHistoryAsync(string username);
        Task<IEnumerable<SuspiciousLogin>> GetSuspiciousLoginsAsync();
        Task<IEnumerable<ActiveSession>> GetActiveUsersAsync();
    }
}
