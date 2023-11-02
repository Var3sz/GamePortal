using GamePortal.DAOs;
using GamePortal.Models;
using GamePortal.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GamePortal.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RegistrationController : ControllerBase
    {
        private readonly ILogger<RegistrationController> _logger;
        private readonly IPlayerRepository _playerRepository;
        public RegistrationController(ILogger<RegistrationController> logger, IPlayerRepository playerRepository)
        {
            _logger = logger;
            _playerRepository = playerRepository;
        }

        [HttpPost]
        public Player Registration(RegistrationForm registrationForm)
        {
            Player player = new Player();
            var players = _playerRepository.GetPlayers();
            foreach(Player p in players)
            {
                if (p.UserName == registrationForm.UserName || p.Email == registrationForm.Email)
                {
                    return null;
                }
            }
            player.FullName = registrationForm.FullName;
            player.UserName = registrationForm.UserName;
            player.Email = registrationForm.Email;
            player.Password = registrationForm.Password;
            player.Birthdate = registrationForm.BirthDate;

            _playerRepository.InsertPlayer(player);

            return player;
        }
    }

    public class RegistrationForm
    {
        public string FullName { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public DateTime BirthDate { get; set; }
    } 
}
