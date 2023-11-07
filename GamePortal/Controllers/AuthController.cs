using GamePortal.DTOs;
using GamePortal.Models;
using GamePortal.Repository;
using GamePortal.Security;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace GamePortal.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ILogger<AuthController> _logger;
        private readonly IPlayerRepository _playerRepository;

        public AuthController(IPlayerRepository playerRepository, ILogger<AuthController> logger)
        {
            _playerRepository = playerRepository;
            _logger = logger;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDTO credentials)
        {
            if (credentials == null)
            {
                return BadRequest("Invalid client request");
            }

            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("superSecretKey@345"));
            var signingCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
            var tokenOptions = new JwtSecurityToken(
                issuer: "http://localhost:5086",
                audience: "http://localhost:5086",
                claims: new List<Claim>(),
                expires: DateTime.Now.AddMinutes(10),
                signingCredentials: signingCredentials
            );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(tokenOptions);


            if (credentials.UserName == "admin" && credentials.Password == "admin")
            {
                Player adminPlayer = new Player();
                adminPlayer.UserName = credentials.UserName;
                adminPlayer.Password = credentials.Password;
                return Ok(new AuthenticatedResponse { player = adminPlayer, Token = tokenString });
            }

            List<Player> players = _playerRepository.GetPlayers();

            foreach(Player player in players)
            {
                if (player.UserName == credentials.UserName && player.Password == credentials.Password)
                {
                    return Ok(new AuthenticatedResponse { player = player, Token = tokenString });
                }
            }
            return Unauthorized();
        }


        [HttpPost("registration")]
        public IActionResult Registration([FromBody] RegisterDTO credentials)
        {
            if (credentials == null)
            {
                return BadRequest("Invalid client request");
            }

            Player player = new Player();
            var players = _playerRepository.GetPlayers();
            foreach (Player p in players)
            {
                if (p.UserName == credentials.UserName || p.Email == credentials.Email)
                {
                    return Conflict();
                }
            }

            player.FullName = credentials.FullName!;
            player.UserName = credentials.UserName!;
            player.Email = credentials.Email!;
            player.Password = credentials.Password!;
            player.Birthdate = credentials.Birthdate!;

            _playerRepository.InsertPlayer(player);


            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("superSecretKey@345"));
            var signingCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
            var tokenOptions = new JwtSecurityToken(
                issuer: "http://localhost:5086",
                audience: "http://localhost:5086",
                claims: new List<Claim>(),
                expires: DateTime.Now.AddMinutes(10),
                signingCredentials: signingCredentials
            );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(tokenOptions);

            return Ok(new AuthenticatedResponse { player = player, Token = tokenString });
        }
    }
}
