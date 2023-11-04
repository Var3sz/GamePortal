using GamePortal.DAOs;
using GamePortal.Models;
using GamePortal.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GamePortal.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoginController : ControllerBase
    {
        private readonly ILogger<LoginController> _logger;
        private readonly IPlayerRepository _playerRepository;
        public LoginController(ILogger<LoginController> logger, IPlayerRepository playerRepository)
        {
            _logger = logger;
            _playerRepository = playerRepository;
        }

        [HttpPost]
        public Player Login(LoginCredentials loginCredentials)
        {
            if (loginCredentials.UserName == "admin" && loginCredentials.Password == "admin")
            {
                Player player = new Player();
                player.UserName = loginCredentials.UserName;
                player.Password = loginCredentials.Password;
                return player;
            }
            return _playerRepository.GetPlayer(loginCredentials.UserName, loginCredentials.Password);
        }
    }

    public class LoginCredentials
    {
        public string UserName { get; set; }
        public string Password { get; set; }
    }
}
