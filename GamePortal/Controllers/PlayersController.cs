    using GamePortal.DAOs;
using GamePortal.Models;
using GamePortal.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GamePortal.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PlayersController : ControllerBase
    {
        private readonly IPlayerRepository _playerRepository;
        private readonly ILogger<PlayersController> _logger;
        public PlayersController(ILogger<PlayersController> logger, IPlayerRepository playerRepository)
        {
            _logger = logger;
            _playerRepository = playerRepository;
        }

        [HttpGet]
        public List<Player> GetPlayers()
        {
            return _playerRepository.GetPlayers();
        }


        [HttpPost]
        public void RemovePlayer(Player player)
        {
            new SavedGameDAO().RemoveSavedGames(player.PlayerId);
            _playerRepository.RemovePlayer(player);
        }
    }
}
