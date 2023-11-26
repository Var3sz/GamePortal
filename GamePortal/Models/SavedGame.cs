using System;
using System.Collections.Generic;

namespace GamePortal.Models
{
    public partial class SavedGame
    {
        public int SavedGameId { get; set; }
        public int GameId { get; set; }
        public string GameUrl { get; set; } = null!;
        public string GameState { get; set; } = null!;
        public virtual Game Game { get; set; } = null!;

        public int? PlayerOneId { get; set; }
        public virtual Player PlayerOne { get; set; } = null!;

        public int? PlayerTwoId { get; set; }
        public virtual Player PlayerTwo { get; set; } = null!;
    }
}
