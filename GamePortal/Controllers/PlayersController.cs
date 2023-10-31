using GamePortal.DAOs;
using GamePortal.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GamePortal.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PlayersController : ControllerBase
    {
        private readonly ILogger<PlayersController> _logger;
        public PlayersController(ILogger<PlayersController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public List<Player> GetPlayers()
        {
            return new PlayerDAO().GetPlayers();
        }


        [HttpPost]
        public void RemovePlayer(Player player)
        {
            new SavedGameDAO().RemoveSavedGames(player.PlayerId);
            new PlayerDAO().RemovePlayer(player);
        }
    }
}
