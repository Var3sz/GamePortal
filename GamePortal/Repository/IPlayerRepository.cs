using GamePortal.Models;

namespace GamePortal.Repository
{
    public interface IPlayerRepository
    {
        List<Player> GetPlayers();
        Player GetPlayerByUsernameAndPassword(string userName, string password);
        Player GetPlayerByUsername(string userName);
        Player GetPlayerById(int playerId);
        void UpdateRefreshToken(int playerId, string refreshToken, DateTime tokenExpiryDate);
        void InsertPlayer(Player player);
        void RemovePlayer(Player player);
    }
}
