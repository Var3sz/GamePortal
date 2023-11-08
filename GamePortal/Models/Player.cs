﻿namespace GamePortal.Models
{
    public partial class Player
    {
        public Player()
        {
            HasRoles = new HashSet<HasRole>();
            SavedGames = new HashSet<SavedGame>();
        }

        public int PlayerId { get; set; }
        public string FullName { get; set; } = null!;
        public string UserName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public DateTime Birthdate { get; set; }

        public virtual ICollection<HasRole> HasRoles { get; set; }
        public virtual ICollection<SavedGame> SavedGames { get; set; }
    }
}
