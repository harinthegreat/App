using SocialMediaBackend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SocialMediaBackend.Repositories
{
    public interface IGroupRepository
    {
        Task<Group?> GetGroupByIdAsync(int id);
        Task<Group?> GetGroupByNameAsync(string name); 
        Task<IEnumerable<Group>> GetAllGroupsAsync();
        Task CreateGroupAsync(Group group);
        Task UpdateGroupAsync(Group group);
        Task DeleteGroupAsync(Group group);
        Task<IEnumerable<GroupMembership>> GetGroupMembersAsync(int groupId);
        Task AddMembershipAsync(GroupMembership membership);
        Task RemoveMembershipAsync(GroupMembership membership);
        Task<GroupMembership?> GetMembershipAsync(int groupId, int userId);
        Task PromoteMemberAsync(int groupId, int userId);
        Task BanMemberAsync(int groupId, int userId);
    }
}