using SocialMediaBackend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SocialMediaBackend.Repositories
{
    public interface IPostRepository
    {
        Task<Post?> GetPostByIdAsync(int id);
        Task<IEnumerable<Post>> GetPostsByGroupAsync(int groupId);
        Task<IEnumerable<Post>> GetPublicPostsAsync();
        Task CreatePostAsync(Post post);
        Task UpdatePostAsync(Post post);
        Task DeletePostAsync(Post post);
        Task AddInteractionAsync(PostInteraction interaction);
    }
}