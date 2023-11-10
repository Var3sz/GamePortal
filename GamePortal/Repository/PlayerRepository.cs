using GamePortal.Models;
using Microsoft.EntityFrameworkCore;

namespace GamePortal.Repository
{
    public class PlayerRepository : IPlayerRepository
    {
        private readonly GamePortalDbContext _dbContext;

        public PlayerRepository(GamePortalDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public List<Player> GetPlayers()
        {
            return _dbContext.Players.ToList();
        }

        public Player GetPlayerById(int playerId)
        {
            return _dbContext.Players.SingleOrDefault(q => q.PlayerId == playerId)!;
        }

        public Player GetPlayerByUsername(string userName)
        {
            return _dbContext.Players.SingleOrDefault(q => q.UserName == userName)!;
        }

        public Player GetPlayerByUsernameAndPassword(string userName, string password)
        {
            return _dbContext.Players.SingleOrDefault(
                q => q.UserName == userName && q.Password == password)!;
        }

        public void InsertPlayer(Player player)
        {
            _dbContext.Players.Add(player);
            _dbContext.SaveChanges();
        }

        public void RemovePlayer(Player player)
        {
            _dbContext.Players.Remove(player);
            _dbContext.SaveChanges();
        }
        public void UpdateRefreshToken(int playerId, string refreshToken, DateTime tokenExpiryTime)
        {
            var player = _dbContext.Players.Single(q => q.PlayerId == playerId);
            player.RefreshToken = refreshToken;
            player.RefreshTokenExpiryTime = tokenExpiryTime;
            _dbContext.SaveChanges();
        }
    }
}
