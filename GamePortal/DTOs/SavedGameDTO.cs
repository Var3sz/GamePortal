namespace GamePortal.DTOs
{
    public class SavedGameDTO
    {
        public int GameId { get; set; }
        public string GameUrl { get; set; } = null!;
        public string GameState { get; set; } = null!;
        public int PlayerOneId { get; set; }
        public int PlayerTwoId { get; set; }
    }
}
