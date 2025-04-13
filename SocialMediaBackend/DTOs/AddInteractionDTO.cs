using SocialMediaBackend.Models;

namespace SocialMediaBackend.DTOs
{
    public class AddInteractionDTO
    {
        public InteractionType InteractionType { get; set; }
        public string? CommentText { get; set; }
    }
}