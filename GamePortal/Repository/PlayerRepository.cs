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
            return _dbContext.Players.Include(p => p.Roles).ToList();
        }

        public Player GetPlayerById(int playerId)
        {
            return _dbContext.Players.Include(p => p.Roles)
                .SingleOrDefault(q => q.PlayerId == playerId)!;
        }

        public Player GetPlayerByUsername(string userName)
        {
            return _dbContext.Players.Include(p => p.Roles).
                SingleOrDefault(q => q.UserName == userName)!;
        }

        public Player GetPlayerByUsernameAndPassword(string userName, string password)
        {
            return _dbContext.Players.Include(p => p.Roles).SingleOrDefault(
                q => q.UserName == userName && q.Password == password)!;
        }

        public void InsertPlayer(Player player)
        {
            _dbContext.Players.Add(player);
            _dbContext.SaveChanges();
        }

        public void RemovePlayer(Player player)
        {
            var playerToRemove = _dbContext.Players
                .Include(p => p.Roles)
                .FirstOrDefault(p => p.PlayerId == player.PlayerId);

            if (playerToRemove != null)
            {
                if (playerToRemove.Roles != null)
                {
                    playerToRemove.Roles.Clear();
                }

                _dbContext.Players.Remove(playerToRemove);
                _dbContext.SaveChanges();
            }
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
