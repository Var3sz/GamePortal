using GamePortal.Models;

namespace GamePortal.Repository
{
    public class SavedGamesRepository : ISavedGamesRepository
    {
        private readonly GamePortalDbContext _context;

        public SavedGamesRepository(GamePortalDbContext context)
        {
            _context = context;
        }

        public void RemoveSavedGames(int playerId)
        {
            _context.SavedGames.RemoveRange(_context.SavedGames.Where(q => q.PlayerOneId == playerId));
            _context.SaveChanges();
        }
    }
}
