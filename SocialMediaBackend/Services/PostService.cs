using SocialMediaBackend.Models;
using SocialMediaBackend.Repositories;
using System.Threading.Tasks;

namespace SocialMediaBackend.Services
{
    public class PostService
    {
        private readonly IPostRepository _postRepository;
        private readonly IGroupRepository _groupRepository;

        public PostService(IPostRepository postRepository, IGroupRepository groupRepository)
        {
            _postRepository = postRepository;
            _groupRepository = groupRepository;
        }

        public async Task<Post> CreatePostAsync(int userId, int? groupId, string content, string mediaUrls, PostType postType)
        {
            if (groupId.HasValue)
            {
                var group = await _groupRepository.GetGroupByIdAsync(groupId.Value);
                if (group == null)
                    throw new Exception("Group not found");

                if (group.IsBanned || group.IsMuted)
                    throw new Exception("Cannot post in this group");

                var membership = await _groupRepository.GetMembershipAsync(groupId.Value, userId);
                if (membership == null || membership.IsBanned)
                    throw new Exception("User is not authorized to post in this group");
            }

            var post = new Post
            {
                UserId = userId,
                GroupId = groupId,
                Content = content,
                MediaUrls = mediaUrls,
                PostType = postType
            };

            await _postRepository.CreatePostAsync(post);
            return post;
        }

        public async Task DeletePostAsync(int postId, int userId)
        {
            var post = await _postRepository.GetPostByIdAsync(postId);
            if (post == null)
                throw new Exception("Post not found");

            if (post.UserId == userId)
            {
                await _postRepository.DeletePostAsync(post);
                return;
            }

            if (post.GroupId.HasValue)
            {
                var membership = await _groupRepository.GetMembershipAsync(post.GroupId.Value, userId);
                if (membership != null && membership.Role == MembershipRole.Admin)
                {
                    await _postRepository.DeletePostAsync(post);
                    return;
                }
            }

            throw new Exception("Unauthorized to delete this post");
        }

        public async Task AddInteractionAsync(int postId, int userId, InteractionType interactionType, string? commentText)
        {
            var post = await _postRepository.GetPostByIdAsync(postId);
            if (post == null)
                throw new Exception("Post not found");

            if (post.GroupId.HasValue)
            {
                var membership = await _groupRepository.GetMembershipAsync(post.GroupId.Value, userId);
                if (membership == null || membership.IsBanned)
                    throw new Exception("User is not authorized to interact with this post");
            }

            var interaction = new PostInteraction
            {
                PostId = postId,
                UserId = userId,
                InteractionType = interactionType,
                CommentText = commentText
            };

            await _postRepository.AddInteractionAsync(interaction);
        }
    }
}