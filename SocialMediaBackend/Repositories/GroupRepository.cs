using Microsoft.EntityFrameworkCore;
using SocialMediaBackend.Data;
using SocialMediaBackend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SocialMediaBackend.Repositories
{
    public class GroupRepository : IGroupRepository
    {
        private readonly AppDbContext _context;

        public GroupRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Group?> GetGroupByIdAsync(int id)
        {
            return await _context.Groups
                .Include(g => g.Memberships)
                .ThenInclude(m => m.User)
                .Include(g => g.Posts)
                .Include(g => g.Creator)
                .FirstOrDefaultAsync(g => g.GroupId == id);
        }

        public async Task<Group?> GetGroupByNameAsync(string name)
        {
            return await _context.Groups
                .Include(g => g.Memberships)
                .ThenInclude(m => m.User)
                .Include(g => g.Posts)
                .Include(g => g.Creator)
                .FirstOrDefaultAsync(g => g.Name == name);
        }

        public async Task<IEnumerable<Group>> GetAllGroupsAsync()
        {
            return await _context.Groups.ToListAsync();
        }

        public async Task CreateGroupAsync(Group group)
        {
            if (await _context.Groups.AnyAsync(g => g.Name == group.Name))
                throw new Exception("Group name already exists");
            _context.Groups.Add(group);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateGroupAsync(Group group)
        {
            if (await _context.Groups.AnyAsync(g => g.Name == group.Name && g.GroupId != group.GroupId))
                throw new Exception("Group name already exists");
            _context.Groups.Update(group);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteGroupAsync(Group group)
        {
            _context.Groups.Remove(group);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<GroupMembership>> GetGroupMembersAsync(int groupId)
        {
            return await _context.GroupMemberships
                .Where(m => m.GroupId == groupId)
                .Include(m => m.User)
                .ToListAsync();
        }

        public async Task AddMembershipAsync(GroupMembership membership)
        {
            _context.GroupMemberships.Add(membership);
            await _context.SaveChangesAsync();
        }

        public async Task RemoveMembershipAsync(GroupMembership membership)
        {
            _context.GroupMemberships.Remove(membership);
            await _context.SaveChangesAsync();
        }

        public async Task<GroupMembership?> GetMembershipAsync(int groupId, int userId)
        {
            return await _context.GroupMemberships
                .FirstOrDefaultAsync(m => m.GroupId == groupId && m.UserId == userId);
        }

        public async Task PromoteMemberAsync(int groupId, int userId)
        {
            var membership = await GetMembershipAsync(groupId, userId);
            if (membership != null)
            {
                membership.Role = MembershipRole.Admin;
                await _context.SaveChangesAsync();
            }
        }

        public async Task BanMemberAsync(int groupId, int userId)
        {
            var membership = await GetMembershipAsync(groupId, userId);
            if (membership != null)
            {
                membership.IsBanned = true;
                await _context.SaveChangesAsync();
            }
        }
    }
}