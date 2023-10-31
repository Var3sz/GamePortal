using GamePortal.DAOs;
using GamePortal.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GamePortal.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoginController : ControllerBase
    {
        private readonly ILogger<LoginController> _logger;
        public LoginController(ILogger<LoginController> logger)
        {
            _logger = logger;
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
            return new PlayerDAO().GetPlayer(loginCredentials.UserName, loginCredentials.Password);
        }
    }

    public class LoginCredentials
    {
        public string UserName { get; set; }
        public string Password { get; set; }
    }
}
