using SocialMediaBackend.Models;

namespace SocialMediaBackend.DTOs
{
    public class CreatePostDTO
    {
        public int? GroupId { get; set; }
        public string Content { get; set; } = string.Empty;
        public string MediaUrls { get; set; } = string.Empty;
        public PostType PostType { get; set; }
    }
}