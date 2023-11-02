using GamePortal.Models;

namespace GamePortal.Repository
{
    public interface IPlayerRepository
    {
        List<Player> GetPlayers();
        Player GetPlayer(string userName, string password);
        Player GetPlayerById(int playerId);
        void InsertPlayer(Player player);
        void RemovePlayer(Player player);
    }
}
