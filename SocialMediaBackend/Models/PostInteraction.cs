using System;

namespace SocialMediaBackend.Models
{
    public class PostInteraction
    {
        public int InteractionId { get; set; }
        public int PostId { get; set; }
        public Post Post { get; set; } 
        public InteractionType InteractionType { get; set; }
        public int UserId { get; set; }
        public User User { get; set; } = null!;
        public string? CommentText { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    } 

    public enum InteractionType
    {
        Like,
        Comment,
        Share
    }
}