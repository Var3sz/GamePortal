using GamePortal.Models;
using GamePortal.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GamePortal.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PlayersController : ControllerBase
    {
        private readonly IPlayerRepository _playerRepository;
        private readonly ISavedGamesRepository _savedGamesRepository;
        public PlayersController(
            IPlayerRepository playerRepository,
            ISavedGamesRepository savedGamesRepository
        )
        {
            _playerRepository = playerRepository;
            _savedGamesRepository = savedGamesRepository;
        }

        [HttpGet, Authorize(Roles = "admin, player")]
        public List<Player> GetPlayers()
        {
            return _playerRepository.GetPlayers();
        }


        [HttpDelete, Authorize(Roles = "admin")]
        public void RemovePlayer([FromBody] Player player)
        {
            _savedGamesRepository.RemoveSavedGame(player.PlayerId);
            _playerRepository.RemovePlayer(player);
        }
    }
}
