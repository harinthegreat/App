using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.IO;
using SocialMediaBackend.Models;

namespace SocialMediaBackend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public AppDbContext() { }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                var configuration = new ConfigurationBuilder()
                    .SetBasePath(Directory.GetCurrentDirectory())
                    .AddJsonFile("appsettings.json")
                    .Build();

                optionsBuilder.UseSqlite(configuration.GetConnectionString("DefaultConnection"));
            }
        }

        public DbSet<User> Users { get; set; }
        public DbSet<LoginHistory> LoginHistories { get; set; }
        public DbSet<SuspiciousLogin> SuspiciousLogins { get; set; }
        public DbSet<ActiveSession> ActiveSessions { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<GroupMembership> GroupMemberships { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<PostInteraction> PostInteractions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().HasKey(u => u.Id);
            modelBuilder.Entity<LoginHistory>().HasKey(lh => lh.Id);
            modelBuilder.Entity<SuspiciousLogin>().HasKey(sl => sl.Id);
            modelBuilder.Entity<ActiveSession>().HasKey(s => s.Id);
            modelBuilder.Entity<Group>().HasKey(g => g.GroupId);
            modelBuilder.Entity<GroupMembership>().HasKey(gm => gm.MembershipId);
            modelBuilder.Entity<Post>().HasKey(p => p.PostId);
            modelBuilder.Entity<PostInteraction>().HasKey(pi => pi.InteractionId);

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<Group>()
                .HasIndex(g => g.Name)
                .IsUnique(); 

            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    Username = "admin",
                    Email = "admin@example.com",
                    PasswordHash = "hashed_password_here",
                    Role = "Admin"
                }
            );

            modelBuilder.Entity<Group>()
                .HasOne(g => g.Creator)
                .WithMany(u => u.CreatedGroups)
                .HasForeignKey(g => g.CreatorId);

            modelBuilder.Entity<GroupMembership>()
                .HasOne(gm => gm.Group)
                .WithMany(g => g.Memberships)
                .HasForeignKey(gm => gm.GroupId);

            modelBuilder.Entity<GroupMembership>()
                .HasOne(gm => gm.User)
                .WithMany(u => u.GroupMemberships)
                .HasForeignKey(gm => gm.UserId);

            modelBuilder.Entity<Post>()
                .HasOne(p => p.User)
                .WithMany(u => u.Posts)
                .HasForeignKey(p => p.UserId);

            modelBuilder.Entity<Post>()
                .HasOne(p => p.Group)
                .WithMany(g => g.Posts)
                .HasForeignKey(p => p.GroupId);

            modelBuilder.Entity<PostInteraction>()
                .HasOne(pi => pi.Post)
                .WithMany()
                .HasForeignKey(pi => pi.PostId);

            modelBuilder.Entity<PostInteraction>()
                .HasOne(pi => pi.User)
                .WithMany(u => u.PostInteractions)
                .HasForeignKey(pi => pi.UserId);

            modelBuilder.Entity<Group>()
                .HasIndex(g => g.CreatorId);

            modelBuilder.Entity<GroupMembership>()
                .HasIndex(gm => new { gm.GroupId, gm.UserId });

            modelBuilder.Entity<Post>()
                .HasIndex(p => p.GroupId);

            modelBuilder.Entity<PostInteraction>()
                .HasIndex(pi => pi.PostId);
        }
    }
}
