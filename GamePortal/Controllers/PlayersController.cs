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
        private readonly IHasRoleRepository _hasRoleRepository;
        private readonly ILogger<PlayersController> _logger;
        public PlayersController(
            ILogger<PlayersController> logger, 
            IPlayerRepository playerRepository,
            ISavedGamesRepository savedGamesRepository,
            IHasRoleRepository hasRoleRepository
        )
        {
            _logger = logger;
            _playerRepository = playerRepository;
            _savedGamesRepository = savedGamesRepository;
            _hasRoleRepository = hasRoleRepository;
        }

        [HttpGet]
        public List<Player> GetPlayers()
        {
            return _playerRepository.GetPlayers();
        }


        [HttpPost]
        public void RemovePlayer(Player player)
        {
            _hasRoleRepository.RemoveHasRoles(player.PlayerId);
            _savedGamesRepository.RemoveSavedGames(player.PlayerId);
            _playerRepository.RemovePlayer(player);
        }
    }
}
