using System;

namespace SocialMediaBackend.Models
{
    public class GroupMembership
    {
        public int MembershipId { get; set; }
        public int GroupId { get; set; }
        public Group Group { get; set; } = null!;
        public int UserId { get; set; }
        public User User { get; set; } = null!;
        public MembershipRole Role { get; set; }
        public bool IsBanned { get; set; } = false;
        public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
    }

    public enum MembershipRole
    {
        Admin,
        Member
    }
}