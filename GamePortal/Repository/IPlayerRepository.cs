using GamePortal.Models;

namespace GamePortal.Repository
{
    public interface IPlayerRepository
    {
        List<Player> GetPlayers();
        Player GetPlayer(string userName, string password);
        Player GetPlayerById(int playerId);
        void UpdateRefreshToken(int playerId, string refreshToken, DateTime tokenExpiryDate);
        void InsertPlayer(Player player);
        void RemovePlayer(Player player);
    }
}
