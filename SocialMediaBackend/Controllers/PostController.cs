using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SocialMediaBackend.DTOs;
using SocialMediaBackend.Services;
using System.Threading.Tasks;
using SocialMediaBackend.Models;
using System.Collections.Generic;
using SocialMediaBackend.Repositories;

namespace SocialMediaBackend.Controllers
{
    [ApiController]
    [Route("api/posts")]
    public class PostController : ControllerBase
    {
        private readonly PostService _postService;
        private readonly IPostRepository _postRepository;
        private readonly IGroupRepository _groupRepository;

        public PostController(PostService postService, IPostRepository postRepository, IGroupRepository groupRepository)
        {
            _postService = postService;
            _postRepository = postRepository;
            _groupRepository = groupRepository;
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreatePost([FromBody] CreatePostDTO request)
        {
            var userId = int.Parse(User.FindFirst("UserId")!.Value);
            var post = await _postService.CreatePostAsync(userId, request.GroupId, request.Content, request.MediaUrls, request.PostType);
            return CreatedAtAction(nameof(GetPost), new { id = post.PostId }, new { post.PostId, message = "Post created successfully" });
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPost(int id)
        {
            var post = await _postRepository.GetPostByIdAsync(id);
            if (post == null)
                return NotFound(new { error = "Post not found" });
            return Ok(post);
        }

        [HttpGet("public")]
        public async Task<IActionResult> GetPublicPosts()
        {
            var posts = await _postRepository.GetPublicPostsAsync();
            return Ok(posts);
        }

        [Authorize]
        [HttpGet("group/{groupId}")]
        public async Task<IActionResult> GetGroupPosts(int groupId)
        {
            var userId = int.Parse(User.FindFirst("UserId")!.Value);
            var membership = await _groupRepository.GetMembershipAsync(groupId, userId);
            if (membership == null || membership.IsBanned)
                return Unauthorized(new { error = "Not authorized to view group posts" });

            var posts = await _postRepository.GetPostsByGroupAsync(groupId);
            return Ok(posts);
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePost(int id)
        {
            var userId = int.Parse(User.FindFirst("UserId")!.Value);
            await _postService.DeletePostAsync(id, userId);
            return Ok(new { message = "Post deleted successfully" });
        }

        [Authorize]
        [HttpPost("{id}/interact")]
        public async Task<IActionResult> AddInteraction(int id, [FromBody] AddInteractionDTO request)
        {
            var userId = int.Parse(User.FindFirst("UserId")!.Value);
            await _postService.AddInteractionAsync(id, userId, request.InteractionType, request.CommentText);
            return Ok(new { message = "Interaction added successfully" });
        }
    }
}