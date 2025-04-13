using System;

namespace SocialMediaBackend.Models
{
    public class LoginHistory
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string IpAddress { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}