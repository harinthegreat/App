using System;

namespace SocialMediaBackend.Models;

public class Post
{
    public int PostId { get; set; }
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public int? GroupId { get; set; }
    public Group? Group { get; set; }
    public string Content { get; set; } = string.Empty;
    public string MediaUrls { get; set; } = string.Empty;
    public PostType PostType {  get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public enum PostType
{
    Text,
    Photo,
    Video,
    Poll,
    Question
}

