using System;
using System.Collections.Generic;

namespace GamePortal.Models
{
    public partial class SavedGame
    {
        public int SavedGameId { get; set; }
        public int GameId { get; set; }
        public int PlayerId { get; set; }
        public string PlayerOne { get; set; } = null!;
        public string PlayerTwo { get; set; } = null!;
        public string GameState { get; set; } = null!;

        public virtual Game Game { get; set; } = null!;
        public virtual Player Player { get; set; } = null!;
    }
}
