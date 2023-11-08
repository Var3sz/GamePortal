using GamePortal.Models;

namespace GamePortal.Repository
{
    public interface IGameRepository
    {
        List<Game> GetAllGames();
        Game GetGameById(int id);
        Game GetGameByName(string name);
    }
}
