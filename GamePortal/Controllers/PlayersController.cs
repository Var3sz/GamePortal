using GamePortal.Models;
using GamePortal.Repository;
using Microsoft.AspNetCore.Mvc;

namespace GamePortal.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PlayersController : ControllerBase
    {
        private readonly IPlayerRepository _playerRepository;
        private readonly ISavedGamesRepository _savedGamesRepository;
        private readonly ILogger<PlayersController> _logger;
        public PlayersController(
            ILogger<PlayersController> logger, 
            IPlayerRepository playerRepository,
            ISavedGamesRepository savedGamesRepository
        )
        {
            _logger = logger;
            _playerRepository = playerRepository;
            _savedGamesRepository = savedGamesRepository;
        }

        [HttpGet]
        public List<Player> GetPlayers()
        {
            return _playerRepository.GetPlayers();
        }


        [HttpPost]
        public void RemovePlayer(Player player)
        {
            _savedGamesRepository.RemoveSavedGames(player.PlayerId);
            _playerRepository.RemovePlayer(player);
        }
    }
}
