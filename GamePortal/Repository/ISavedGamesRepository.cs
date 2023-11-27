using GamePortal.Models;

namespace GamePortal.Repository
{
    public interface ISavedGamesRepository
    {
        List<SavedGame> GetSavedGamesByPlayerId(int playerId);
        SavedGame GetSavedGame(int savedGameId);
        SavedGame GetSavedGameByUrl(string savedGameUrl);
        void UpdateSavedGame(SavedGame savedGame);
        void InsertSavedGame(SavedGame savedGame);
        void RemoveSavedGame(int playerId);
    }
}
