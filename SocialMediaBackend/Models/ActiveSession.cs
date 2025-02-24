using System;
using System.ComponentModel.DataAnnotations;

namespace SocialMediaBackend.Models
{
    public class ActiveSession
    {
        [Key] 
        public int Id { get; set; }

        [Required]
        public string Username { get; set; } = string.Empty;

        public DateTime LastActive { get; set; } = DateTime.UtcNow;
    }
}
