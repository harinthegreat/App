using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SocialMediaBackend.Repositories;
using SocialMediaBackend.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SocialMediaBackend.DTOs;
using SocialMediaBackend.Services;
using SocialMediaBackend.Data;
using Microsoft.EntityFrameworkCore;

namespace SocialMediaBackend.Controllers
{
    [ApiController]
    [Route("api/auth/admin")]
    [Authorize(Roles = "Admin")] // Restrict to admins only
    public class AdminController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IEmailService _emailService;
        private readonly AppDbContext _context;
        private readonly AdminService _adminService;

        public AdminController(IUserRepository userRepository, IEmailService emailService, AppDbContext context, AdminService adminService)
        {
            _userRepository = userRepository;
            _emailService = emailService;
            _context = context;
            _adminService = adminService;
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userRepository.GetAllUsersAsync();
            return Ok(users);
        }

        // VIEW USER LOGIN HISTORY
        [HttpGet("login-history/{username}")]
        public async Task<IActionResult> GetLoginHistory(string username)
        {
            var history = await _userRepository.GetUserLoginHistoryAsync(username);
            if (history == null || !history.Any())
                return NotFound(new { error = "No login history found for this user." });

            return Ok(history);
        }

        // VIEW SUSPICIOUS LOGINS
        [HttpGet("suspicious-logins")]
        public async Task<IActionResult> GetSuspiciousLogins()
        {
            var logins = await _userRepository.GetSuspiciousLoginsAsync();
            return Ok(logins);
        }

        // VIEW ACTIVE USERS
        [HttpGet("active-users")]
        public async Task<IActionResult> GetActiveUsers()
        {
            var fiveMinutesAgo = DateTime.UtcNow.AddMinutes(-5);
            var activeUsers = await _context.ActiveSessions
                .Where(a => a.LastActive >= fiveMinutesAgo)
                .ToListAsync();

            return Ok(activeUsers);
        }

        // DISABLE MFA FOR A USER
        [HttpPost("disable-mfa/{username}")]
        public async Task<IActionResult> DisableMfa(string username)
        {
            var user = await _userRepository.GetUserByUsernameAsync(username);
            user.IsMfaEnabled = false;
            await _userRepository.UpdateUserAsync(user);
            return Ok(new { message = "MFA disabled for user" });
        }

        // BAN OR UNBAN A USER
        [HttpPost("ban-user/{username}")]
        public async Task<IActionResult> BanUser(string username)
        {
            var user = await _userRepository.GetUserByUsernameAsync(username);
            user.IsBanned = !user.IsBanned;
            await _userRepository.UpdateUserAsync(user);
            return Ok(new { message = user.IsBanned ? "User banned" : "User unbanned" });
        }

        // SEND SECURITY ALERT TO A USER
        [HttpPost("send-alert")]
        public async Task<IActionResult> SendAlert([FromBody] AlertDTO alertDto)
        {
            var user = await _userRepository.GetUserByUsernameAsync(alertDto.Username);
            if (user == null)
                return NotFound(new { error = "User not found." });

            await _emailService.SendEmailAsync(user.Email, "Security Alert", alertDto.Message);
            return Ok(new { message = "Alert sent successfully." });
        }

        [HttpGet("groups")]
        public async Task<IActionResult> GetAllGroups()
        {
            var groups = await _adminService.GetAllGroupsAsync();
            return Ok(groups);
        }

        [HttpPost("groups/{id}/alert")]
        public async Task<IActionResult> SendAlertToGroupAdmins(int id, [FromBody] AlertDTO alertDto)
        {
            await _adminService.SendAlertToGroupAdminsAsync(id, alertDto.Message);
            return Ok(new { message = "Alert sent to group admins" });
        }

        [HttpPost("groups/{id}/ban")]
        public async Task<IActionResult> BanGroup(int id)
        {
            await _adminService.BanGroupAsync(id);
            return Ok(new { message = "Group banned" });
        }

        [HttpDelete("groups/{id}")]
        public async Task<IActionResult> DeleteGroup(int id)
        {
            await _adminService.DeleteGroupAsync(id);
            return Ok(new { message = "Group deleted" });
        }
    }
}
