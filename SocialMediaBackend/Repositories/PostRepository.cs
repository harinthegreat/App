using Microsoft.EntityFrameworkCore;
using SocialMediaBackend.Data;
using SocialMediaBackend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SocialMediaBackend.Repositories
{
    public class PostRepository : IPostRepository
    {
        private readonly AppDbContext _context;

        public PostRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Post?> GetPostByIdAsync(int id)
        {
            return await _context.Posts
                .Include(p => p.User)
                .Include(p => p.Group)
                .FirstOrDefaultAsync(p => p.PostId == id);
        }

        public async Task<IEnumerable<Post>> GetPostsByGroupAsync(int groupId)
        {
            return await _context.Posts
                .Where(p => p.GroupId == groupId)
                .Include(p => p.User)
                .ToListAsync();
        }

        public async Task<IEnumerable<Post>> GetPublicPostsAsync()
        {
            return await _context.Posts
                .Where(p => p.GroupId == null)
                .Include(p => p.User)
                .ToListAsync();
        }

        public async Task CreatePostAsync(Post post)
        {
            _context.Posts.Add(post);
            await _context.SaveChangesAsync();
        }

        public async Task UpdatePostAsync(Post post)
        {
            _context.Posts.Update(post);
            await _context.SaveChangesAsync();
        }

        public async Task DeletePostAsync(Post post)
        {
            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();
        }

        public async Task AddInteractionAsync(PostInteraction interaction)
        {
            _context.PostInteractions.Add(interaction);
            await _context.SaveChangesAsync();
        }
    }
}