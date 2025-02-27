using Microsoft.EntityFrameworkCore;
using SocialMediaBackend.Data;
using SocialMediaBackend.Models;
using System.Threading.Tasks;

namespace SocialMediaBackend.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;

        public UserRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task CreateUserAsync(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<User?> GetUserByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<User?> GetUserByUsernameAsync(string username)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
        }

        public async Task<User?> GetUserByEmailVerificationTokenAsync(string token)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.EmailVerificationToken == token);
        }

        public async Task UpdateUserAsync(User user)
        {
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await _context.Users.ToListAsync();
        }

        public async Task DeleteUserAsync(User user)
        {
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<LoginHistory>> GetUserLoginHistoryAsync(string username)
        {
            return await _context.LoginHistories
                .Where(u => u.Username == username)
                .OrderByDescending(u => u.Timestamp)
                .ToListAsync();

        }

        public async Task<IEnumerable<SuspiciousLogin>> GetSuspiciousLoginsAsync()
        {
            return await _context.SuspiciousLogins.ToListAsync();
        }

        public async Task<IEnumerable<ActiveSession>> GetActiveUsersAsync()
        {
            return await _context.ActiveSessions.ToListAsync();
        }

        public async Task<IEnumerable<Group>> GetUserGroupsAsync(int userId)
        {
            return await _context.Groups
                .Where(g => g.CreatorId == userId)
                .ToListAsync();
        }

        public async Task<IEnumerable<GroupMembership>> GetUserMembershipsAsync(int userId)
        {
            return await _context.GroupMemberships
                .Where(m => m.UserId == userId)
                .Include(m => m.Group)
                .ToListAsync();
        }
    }
}
