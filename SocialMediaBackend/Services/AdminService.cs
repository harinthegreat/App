using SocialMediaBackend.Models;
using SocialMediaBackend.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SocialMediaBackend.Services
{
    public class AdminService
    {
        private readonly IGroupRepository _groupRepository;
        private readonly IEmailService _emailService;

        public AdminService(IGroupRepository groupRepository, IEmailService emailService)
        {
            _groupRepository = groupRepository;
            _emailService = emailService;
        }

        public async Task<IEnumerable<Group>> GetAllGroupsAsync()
        {
            return await _groupRepository.GetAllGroupsAsync();
        }

        public async Task SendAlertToGroupAdminsAsync(int groupId, string message)
        {
            var group = await _groupRepository.GetGroupByIdAsync(groupId);
            if (group == null)
                throw new Exception("Group not found");

            var admins = await _groupRepository.GetGroupMembersAsync(groupId);
            foreach (var admin in admins.Where(m => m.Role == MembershipRole.Admin))
            {
                await _emailService.SendEmailAsync(admin.User.Email, "Admin Alert", message);
            }
        }

        public async Task BanGroupAsync(int groupId)
        {
            var group = await _groupRepository.GetGroupByIdAsync(groupId);
            if (group == null)
                throw new Exception("Group not found");

            group.IsBanned = true;
            await _groupRepository.UpdateGroupAsync(group);
        }

        public async Task DeleteGroupAsync(int groupId)
        {
            var group = await _groupRepository.GetGroupByIdAsync(groupId);
            if (group == null)
                throw new Exception("Group not found");

            await _groupRepository.DeleteGroupAsync(group);
        }
    }
}