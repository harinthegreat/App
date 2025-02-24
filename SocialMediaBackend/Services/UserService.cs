using SocialMediaBackend.Models;
using SocialMediaBackend.Repositories;
using SocialMediaBackend.DTOs;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Collections.Concurrent;
using Newtonsoft.Json;
using System.Net;
using Microsoft.AspNetCore.Http;
using SocialMediaBackend.Data;

namespace SocialMediaBackend.Services
{
    public class UserService
    {
        private readonly IUserRepository _userRepository;
        private readonly JwtService _jwtService;
        private readonly IEmailService _emailService;
        private readonly AppDbContext _context;
        private static readonly ConcurrentDictionary<int, string> _refreshTokens = new();

        public UserService(IUserRepository userRepository, AppDbContext context, JwtService jwtService, IEmailService emailService)
        {
            _userRepository = userRepository;
            _jwtService = jwtService;
            _emailService = emailService;
            _context = context;
        }

        public async Task<MfaSetupResponse> EnableMfaAsync(User user)
        {
            var mfaService = new MfaService();
            user.MfaSecret = mfaService.GenerateSecretKey();
            user.RecoveryCodes = JsonConvert.SerializeObject(mfaService.GenerateRecoveryCodes());
            await _userRepository.UpdateUserAsync(user);

            return new MfaSetupResponse
            {
                SecretKey = user.MfaSecret,
                QrCodeUri = mfaService.GenerateQrCodeUri(user.Email, user.MfaSecret),
                RecoveryCodes = JsonConvert.DeserializeObject<string[]>(user.RecoveryCodes)!
            };
        }

        public async Task<bool> VerifyMfaSetupAsync(User user, string code)
        {
            var mfaService = new MfaService();
            bool isValid = mfaService.ValidateCode(user.MfaSecret!, code);
            if (isValid)
            {
                user.IsMfaEnabled = true;
                await _userRepository.UpdateUserAsync(user);
            }
            return isValid;
        }

        public async Task<bool> VerifyMfaLoginAsync(User user, string code)
        {
            var mfaService = new MfaService();
            return mfaService.ValidateCode(user.MfaSecret!, code);
        }

        public async Task CreateUserAsync(User user)
        {
            user.PasswordHash = HashPassword(user.PasswordHash);
            user.EmailVerificationToken = GenerateVerificationToken();
            user.IsEmailVerified = false; 

            await _userRepository.CreateUserAsync(user);

            var encodedToken = WebUtility.UrlEncode(user.EmailVerificationToken);
            var verificationLink = $"http://localhost:3000/verify-email?token={encodedToken}";

            var emailBody = $"Please verify your email by clicking the link: {verificationLink}";
            await _emailService.SendEmailAsync(user.Email, "Verify your email", emailBody);
        }

        public async Task<bool> VerifyEmailAsync(string token)
        {
            var user = await _userRepository.GetUserByEmailVerificationTokenAsync(token);
            if (user == null)
                return false; 

            user.IsEmailVerified = true;
            user.EmailVerificationToken = null;
            await _userRepository.UpdateUserAsync(user);

            return true;
        }

        public async Task<User?> GetUserByIdAsync(int id)
        {
            return await _userRepository.GetUserByIdAsync(id);
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _userRepository.GetUserByEmailAsync(email);
        }

        public async Task<User?> GetUserByUsernameAsync(string username)
        {
            return await _userRepository.GetUserByUsernameAsync(username);
        }

        public async Task<bool> ValidateUserAsync(string emailOrUsername, string password)
        {
            var user = await _userRepository.GetUserByEmailAsync(emailOrUsername) ??
                       await _userRepository.GetUserByUsernameAsync(emailOrUsername);

            if (user == null)
                return false;

            if (user.IsBanned) 
                return false;

            string hashedPassword = HashPassword(password);
            bool isPasswordValid = user.PasswordHash == hashedPassword;

            bool isEmailVerified = user.IsEmailVerified;
            return isPasswordValid && isEmailVerified;
        }

        public async Task SaveRefreshTokenAsync(int userId, string refreshToken)
        {
            _refreshTokens[userId] = refreshToken;
            await Task.CompletedTask; 
        }

        public async Task<string?> GetRefreshTokenAsync(int userId)
        {
            return _refreshTokens.TryGetValue(userId, out var token) ? token : null;
        }

        public async Task RevokeRefreshTokenAsync(int userId)
        {
            _refreshTokens.TryRemove(userId, out _);
            await Task.CompletedTask; 
        }

        private string GenerateVerificationToken()
        {
            return Convert.ToBase64String(Guid.NewGuid().ToByteArray());
        }

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(password);
            var hash = sha256.ComputeHash(bytes);
            return Convert.ToBase64String(hash);
        }

        public async Task LogLoginAttempt(string username, HttpContext httpContext)
        {
            var ipAddress = httpContext.Connection.RemoteIpAddress?.ToString() ?? "Unknown";

            var loginHistory = new LoginHistory
            {
                Username = username,
                IpAddress = ipAddress,
                Timestamp = DateTime.UtcNow
            };

            _context.LoginHistories.Add(loginHistory);

            var activeUser = _context.ActiveSessions.FirstOrDefault(a=>a.Username == username);
            if (activeUser != null) { 
                activeUser.LastActive = DateTime.UtcNow;
            }
            else
            {
                _context.ActiveSessions.Add(new ActiveSession
                {
                    Username = username,
                    LastActive = DateTime.UtcNow
                });
            }
            await _context.SaveChangesAsync();
        }
    }
}
