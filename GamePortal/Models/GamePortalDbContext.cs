using Microsoft.EntityFrameworkCore;

namespace GamePortal.Models
{
    public partial class GamePortalDbContext : DbContext
    {
        public GamePortalDbContext(DbContextOptions options): base(options) { }

        public virtual DbSet<Game> Games { get; set; } = null!;
        public virtual DbSet<Player> Players { get; set; } = null!;
        public virtual DbSet<Role> Roles { get; set; } = null!;
        public virtual DbSet<SavedGame> SavedGames { get; set; } = null!;

        string connString = "Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=GamePortalDb;Integrated Security=True";

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer(connString);
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            /* Game entity */
            modelBuilder.Entity<Game>(entity =>
            {
                entity.ToTable("Game");

                entity.Property(e => e.GameId).HasColumnName("GameId");

                entity.Property(e => e.Name).HasColumnName("Name")
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false);
            });

            /* Player Entity */
            modelBuilder.Entity<Player>(entity =>
            {
                entity.ToTable("Player");

                entity.Property(e => e.PlayerId).HasColumnName("PlayerId");

                entity.Property(e => e.FullName).HasColumnName("FullName")
                        .IsRequired()
                        .HasMaxLength(255)
                        .IsUnicode(false);

                entity.Property(e => e.UserName).HasColumnName("UserName")
                        .IsRequired()
                        .HasMaxLength(255)
                        .IsUnicode(false);
                
                entity.Property(e => e.Email).HasColumnName("Email")
                        .IsRequired()
                        .HasMaxLength(255)
                        .IsUnicode(false);
                
                entity.Property(e => e.Password).HasColumnName("Password")
                        .IsRequired()
                        .HasMaxLength(100)
                        .IsUnicode(false);
                
                entity.Property(e => e.Birthdate).HasColumnName("Birthdate")
                        .IsRequired()
                        .HasColumnType("date");

                entity.HasMany(e => e.Roles).WithMany(e => e.Players);
            });

            modelBuilder.Entity<Role>(entity =>
            {
                entity.ToTable("Role");

                entity.Property(e => e.RoleId).HasColumnName("RoleId");

                entity.Property(e => e.Name).HasColumnName("Name")
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<SavedGame>(entity =>
            {
                entity.ToTable("SavedGame");

                entity.Property(e => e.SavedGameId).HasColumnName("SavedGameId");

                entity.Property(e => e.GameId).HasColumnName("GameId");

                entity.Property(e => e.PlayerId).HasColumnName("PlayerId");


                entity.Property(e => e.GameState).HasColumnName("GameState")
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.PlayerOne).HasColumnName("PlayerOne")
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.PlayerTwo).HasColumnName("PlayerTwo")
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.HasOne(d => d.Game)
                    .WithMany(p => p.SavedGames)
                    .HasForeignKey(d => d.GameId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Game_SavedGame");

                entity.HasOne(d => d.Player)
                    .WithMany(p => p.SavedGames)
                    .HasForeignKey(d => d.PlayerId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Player_SavedGame");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
