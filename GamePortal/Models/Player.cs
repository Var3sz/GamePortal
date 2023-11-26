using Microsoft.AspNetCore.SignalR;
using System.ComponentModel.DataAnnotations;

namespace GamePortal.Models
{
    /* Plazer model representing Player table */

    public partial class Player
    {
        public Player()
        {
            SavedGames1 = new HashSet<SavedGame>();
            SavedGames2 = new HashSet<SavedGame>();
        }

        public int PlayerId { get; set; }
        public string FullName { get; set; } = null!;
        public string UserName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public DateTime Birthdate { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime RefreshTokenExpiryTime { get; set; }
        public List<Role> Roles { get; set; } = new();

        public IEnumerable<SavedGame> SavedGames
            => SavedGames1.Concat(SavedGames2).Distinct();
        public virtual ICollection<SavedGame> SavedGames1 { get; set; }
        public virtual ICollection<SavedGame> SavedGames2 { get; set; }
    }
}
