using System;
using System.Collections.Generic;

namespace GamePortal.Models
{
    public partial class Game
    {
        public Game()
        {
            SavedGames = new HashSet<SavedGame>();
        }

        public int GameId { get; set; }
        public string Name { get; set; } = null!;

        public virtual ICollection<SavedGame> SavedGames { get; set; }
    }
}
