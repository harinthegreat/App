using System;
using System.Collections.Generic;

namespace SocialMediaBackend.Models
{
    public class Group
    {
        public int GroupId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int CreatorId { get; set; }
        public User Creator { get; set; } = null!;
        public JoiningPreference JoiningPreference { get; set; }
        public bool IsMuted { get; set; }
        public bool IsBanned { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public List<GroupMembership> Memberships { get; set; } = new();
        public List<Post> Posts { get; set; } = new();
    }

    public enum JoiningPreference
    {
        Public,
        Private,
        InviteOnly
    }
}