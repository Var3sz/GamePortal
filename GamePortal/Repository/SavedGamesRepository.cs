using GamePortal.Models;
using Microsoft.EntityFrameworkCore;

namespace GamePortal.Repository
{
    public class SavedGamesRepository : ISavedGamesRepository
    {
        private readonly GamePortalDbContext _dbContext;

        public SavedGamesRepository(GamePortalDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public SavedGame GetSavedGame(int savedGameId)
        {
            return _dbContext.SavedGames
                    .Include(s => s.PlayerOne)
                    .Include(s => s.PlayerTwo)
                    .Include(s => s.Game)
                    .FirstOrDefault(s => s.SavedGameId == savedGameId)!;
        }

        public List<SavedGame> GetSavedGamesByPlayerId(int playerId)
        {
            return _dbContext.SavedGames
                .Include(s => s.PlayerOne)
                .Include(s => s.PlayerTwo)
                .Include(s => s.Game)
                .Where(s => s.PlayerOneId == playerId || s.PlayerTwoId == playerId)
                .ToList();
        }

        public void InsertSavedGame(SavedGame savedGame)
        {
            _dbContext.SavedGames.Add(savedGame);
            _dbContext.SaveChanges();
        }

        public void UpdateSavedGame(SavedGame savedGame)
        {
            _dbContext.SavedGames.Update(savedGame);
            _dbContext.SaveChanges();
        }

        public void RemoveSavedGame(int playerId)
        {
            var savedGamesToRemove = _dbContext.SavedGames
                .Where(q => q.PlayerOneId == playerId || q.PlayerTwoId == playerId);

            _dbContext.SavedGames.RemoveRange(savedGamesToRemove);
            _dbContext.SaveChanges();
        }
    }
}
