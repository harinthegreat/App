using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

namespace SocialMediaBackend.Middlewares
{
    public class GroupActivityLoggingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<GroupActivityLoggingMiddleware> _logger;

        public GroupActivityLoggingMiddleware(RequestDelegate next, ILogger<GroupActivityLoggingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var path = context.Request.Path.Value;
            if (path != null && path.StartsWith("/api/groups"))
            {
                var userId = context.User.FindFirst("UserId")?.Value;
                _logger.LogInformation($"User {userId} performed action on {path} at {DateTime.UtcNow}");
            }

            await _next(context);
        }
    }
}