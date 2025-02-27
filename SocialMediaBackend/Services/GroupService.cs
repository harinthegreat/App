using SocialMediaBackend.Models;
using SocialMediaBackend.Repositories;
using System.Threading.Tasks;

namespace SocialMediaBackend.Services
{
    public class GroupService
    {
        private readonly IGroupRepository _groupRepository;
        private readonly IUserRepository _userRepository;

        public GroupService(IGroupRepository groupRepository, IUserRepository userRepository)
        {
            _groupRepository = groupRepository;
            _userRepository = userRepository;
        }

        public async Task<Group> CreateGroupAsync(int userId, string name, string description, JoiningPreference joiningPreference, bool isMuted)
        {
            var user = await _userRepository.GetUserByIdAsync(userId);
            if (user == null)
                throw new Exception("User not found");

            var group = new Group
            {
                Name = name,
                Description = description,
                CreatorId = userId,
                JoiningPreference = joiningPreference,
                IsMuted = isMuted
            };

            await _groupRepository.CreateGroupAsync(group);

            var membership = new GroupMembership
            {
                GroupId = group.GroupId,
                UserId = userId,
                Role = MembershipRole.Admin
            };
            await _groupRepository.AddMembershipAsync(membership);

            return group;
        }

        public async Task JoinGroupAsync(string groupName, string username)
        {
            var group = await _groupRepository.GetGroupByNameAsync(groupName);
            if (group == null)
                throw new Exception("Group not found");

            var user = await _userRepository.GetUserByUsernameAsync(username);
            if (user == null)
                throw new Exception("User not found");

            if (group.IsBanned)
                throw new Exception("This group is banned");

            if (group.JoiningPreference == JoiningPreference.InviteOnly)
                throw new Exception("This group is invite-only");

            var membership = await _groupRepository.GetMembershipAsync(group.GroupId, user.Id);
            if (membership != null)
                throw new Exception("User is already a member");

            var newMembership = new GroupMembership
            {
                GroupId = group.GroupId,
                UserId = user.Id,
                Role = MembershipRole.Member
            };
            await _groupRepository.AddMembershipAsync(newMembership);
        }

        public async Task UpdateGroupSettingsAsync(string groupName, string adminUsername, string name, string description, JoiningPreference joiningPreference, bool isMuted)
        {
            var group = await _groupRepository.GetGroupByNameAsync(groupName);
            if (group == null)
                throw new Exception("Group not found");

            var admin = await _userRepository.GetUserByUsernameAsync(adminUsername);
            if (admin == null)
                throw new Exception("Admin user not found");

            var membership = await _groupRepository.GetMembershipAsync(group.GroupId, admin.Id);
            if (membership == null || membership.Role != MembershipRole.Admin)
                throw new Exception("Only group admins can update settings");

            group.Name = name;
            group.Description = description;
            group.JoiningPreference = joiningPreference;
            group.IsMuted = isMuted;
            group.UpdatedAt = DateTime.UtcNow;

            await _groupRepository.UpdateGroupAsync(group);
        }

        public async Task DeleteGroupAsync(string groupName, string adminUsername)
        {
            var group = await _groupRepository.GetGroupByNameAsync(groupName);
            if (group == null)
                throw new Exception("Group not found");

            var admin = await _userRepository.GetUserByUsernameAsync(adminUsername);
            if (admin == null)
                throw new Exception("Admin user not found");

            var membership = await _groupRepository.GetMembershipAsync(group.GroupId, admin.Id);
            if (membership == null || membership.Role != MembershipRole.Admin)
                throw new Exception("Only group admins can delete the group");

            await _groupRepository.DeleteGroupAsync(group);
        }

        public async Task PromoteMemberAsync(string groupName, string memberUsername, string adminUsername)
        {
            var group = await _groupRepository.GetGroupByNameAsync(groupName);
            if (group == null)
                throw new Exception("Group not found");

            var admin = await _userRepository.GetUserByUsernameAsync(adminUsername);
            if (admin == null)
                throw new Exception("Admin user not found");

            var adminMembership = await _groupRepository.GetMembershipAsync(group.GroupId, admin.Id);
            if (adminMembership == null || adminMembership.Role != MembershipRole.Admin)
                throw new Exception("Only group admins can promote members");

            var member = await _userRepository.GetUserByUsernameAsync(memberUsername);
            if (member == null)
                throw new Exception("Member not found");

            var memberMembership = await _groupRepository.GetMembershipAsync(group.GroupId, member.Id);
            if (memberMembership == null)
                throw new Exception("Member not found in the group");

            await _groupRepository.PromoteMemberAsync(group.GroupId, member.Id);
        }

        public async Task RemoveMemberAsync(string groupName, string memberUsername, string adminUsername)
        {
            var group = await _groupRepository.GetGroupByNameAsync(groupName);
            if (group == null)
                throw new Exception("Group not found");

            var admin = await _userRepository.GetUserByUsernameAsync(adminUsername);
            if (admin == null)
                throw new Exception("Admin user not found");

            var adminMembership = await _groupRepository.GetMembershipAsync(group.GroupId, admin.Id);
            if (adminMembership == null || adminMembership.Role != MembershipRole.Admin)
                throw new Exception("Only group admins can remove members");

            var member = await _userRepository.GetUserByUsernameAsync(memberUsername);
            if (member == null)
                throw new Exception("Member not found");

            var memberMembership = await _groupRepository.GetMembershipAsync(group.GroupId, member.Id);
            if (memberMembership == null)
                throw new Exception("Member not found in the group");

            await _groupRepository.RemoveMembershipAsync(memberMembership);
        }

        public async Task BanMemberAsync(string groupName, string memberUsername, string adminUsername)
        {
            var group = await _groupRepository.GetGroupByNameAsync(groupName);
            if (group == null)
                throw new Exception("Group not found");

            var admin = await _userRepository.GetUserByUsernameAsync(adminUsername);
            if (admin == null)
                throw new Exception("Admin user not found");

            var adminMembership = await _groupRepository.GetMembershipAsync(group.GroupId, admin.Id);
            if (adminMembership == null || adminMembership.Role != MembershipRole.Admin)
                throw new Exception("Only group admins can ban members");

            var member = await _userRepository.GetUserByUsernameAsync(memberUsername);
            if (member == null)
                throw new Exception("Member not found");

            var memberMembership = await _groupRepository.GetMembershipAsync(group.GroupId, member.Id);
            if (memberMembership == null)
                throw new Exception("Member not found in the group");

            await _groupRepository.BanMemberAsync(group.GroupId, member.Id);
        }
    }
}