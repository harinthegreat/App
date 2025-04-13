using SocialMediaBackend.Models;

namespace SocialMediaBackend.DTOs
{
    public class CreateGroupDTO
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public JoiningPreference JoiningPreference { get; set; }
        public bool IsMuted { get; set; }
    }
}