using GamePortal.Models;

namespace GamePortal.Repository
{
    public class GameRepository : IGameRepository
    {
        public GamePortalDbContext _dbContext;

        public GameRepository(GamePortalDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public Game GetGameById(int id)
        {
            return _dbContext.Games.SingleOrDefault(q => q.GameId == id)!;
        }
    }
}
