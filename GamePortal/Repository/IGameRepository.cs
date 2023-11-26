using GamePortal.Models;

namespace GamePortal.Repository
{
    public interface IGameRepository
    {
        Game GetGameById(int id);
    }
}
