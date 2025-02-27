using SocialMediaBackend.Models;

namespace SocialMediaBackend.DTOs
{
    public class GroupDTO
    {
        public int GroupId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int CreatorId { get; set; }
        public string CreatorUsername { get; set; } = string.Empty;
        public JoiningPreference JoiningPreference { get; set; }
        public bool IsMuted { get; set; }
        public bool IsBanned { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}