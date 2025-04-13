using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SocialMediaBackend.DTOs;
using SocialMediaBackend.Services;
using SocialMediaBackend.Repositories;
using System.Threading.Tasks;

namespace SocialMediaBackend.Controllers
{
    [ApiController]
    [Route("api/groups")]
    public class GroupController : ControllerBase
    {
        private readonly GroupService _groupService;
        private readonly IGroupRepository _groupRepository;

        public GroupController(GroupService groupService, IGroupRepository groupRepository)
        {
            _groupService = groupService;
            _groupRepository = groupRepository;
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateGroup([FromBody] CreateGroupDTO request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = int.Parse(User.FindFirst("UserId")!.Value);
            var group = await _groupService.CreateGroupAsync(userId, request.Name, request.Description, request.JoiningPreference, request.IsMuted);
            return CreatedAtAction(nameof(GetGroup), new { groupName = group.Name }, new { groupName = group.Name, message = "Group created successfully" });
        }

        [Authorize]
        [HttpGet("{groupName}")]
        public async Task<IActionResult> GetGroup(string groupName)
        {
            var group = await _groupRepository.GetGroupByNameAsync(groupName);
            if (group == null)
                return NotFound(new { error = "Group not found" });

            var groupDto = new GroupDTO
            {
                GroupId = group.GroupId,
                Name = group.Name,
                Description = group.Description,
                CreatorId = group.CreatorId,
                CreatorUsername = group.Creator.Username,
                JoiningPreference = group.JoiningPreference,
                IsMuted = group.IsMuted,
                IsBanned = group.IsBanned,
                CreatedAt = group.CreatedAt,
                UpdatedAt = group.UpdatedAt
            };

            return Ok(groupDto);
        }

        [Authorize]
        [HttpPost("{groupName}/join")]
        public async Task<IActionResult> JoinGroup(string groupName)
        {
            var username = User.FindFirst("sub")!.Value; // Get username from JWT
            await _groupService.JoinGroupAsync(groupName, username);
            return Ok(new { message = "Joined group successfully" });
        }

        [Authorize]
        [HttpPut("{groupName}/settings")]
        public async Task<IActionResult> UpdateGroupSettings(string groupName, [FromBody] UpdateGroupSettingsDTO request)
        {
            var username = User.FindFirst("sub")!.Value;
            await _groupService.UpdateGroupSettingsAsync(groupName, username, request.Name, request.Description, request.JoiningPreference, request.IsMuted);
            return Ok(new { message = "Group settings updated successfully" });
        }

        [Authorize]
        [HttpDelete("{groupName}")]
        public async Task<IActionResult> DeleteGroup(string groupName)
        {
            var username = User.FindFirst("sub")!.Value;
            await _groupService.DeleteGroupAsync(groupName, username);
            return Ok(new { message = "Group deleted successfully" });
        }

        [Authorize]
        [HttpPost("{groupName}/promote/{memberUsername}")]
        public async Task<IActionResult> PromoteMember(string groupName, string memberUsername)
        {
            var adminUsername = User.FindFirst("sub")!.Value;
            await _groupService.PromoteMemberAsync(groupName, memberUsername, adminUsername);
            return Ok(new { message = "Member promoted to admin" });
        }

        [Authorize]
        [HttpPost("{groupName}/remove/{memberUsername}")]
        public async Task<IActionResult> RemoveMember(string groupName, string memberUsername)
        {
            var adminUsername = User.FindFirst("sub")!.Value;
            await _groupService.RemoveMemberAsync(groupName, memberUsername, adminUsername);
            return Ok(new { message = "Member removed from group" });
        }

        [Authorize]
        [HttpPost("{groupName}/ban/{memberUsername}")]
        public async Task<IActionResult> BanMember(string groupName, string memberUsername)
        {
            var adminUsername = User.FindFirst("sub")!.Value;
            await _groupService.BanMemberAsync(groupName, memberUsername, adminUsername);
            return Ok(new { message = "Member banned from group" });
        }
    }
}