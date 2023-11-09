using GamePortal.DTOs;
using GamePortal.Models;
using GamePortal.Repository;
using GamePortal.Security;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
        private readonly IRoleRepository _roleRepository;
        private readonly GamePortalDbContext _gamePortalDbContext;

        public AuthController(IPlayerRepository playerRepository, IRoleRepository roleRepository,GamePortalDbContext gamePortalDbContext , ILogger<AuthController> logger)
        {
            _playerRepository = playerRepository;
            _roleRepository = roleRepository;
            _gamePortalDbContext = gamePortalDbContext;
            _logger = logger;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDTO credentials)
        {
            if (credentials == null)
            {
                return BadRequest("Invalid client request");
            }

            


            if (credentials.UserName == "admin" && credentials.Password == "admin")
            {
                Player adminPlayer = new Player();
                adminPlayer.UserName = credentials.UserName;
                adminPlayer.Password = credentials.Password;

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

                return Ok(new AuthenticatedResponse { player = adminPlayer, Token = tokenString });
            }

            List<Player> players = _playerRepository.GetPlayers();

            foreach(Player player in players)
            {
                if (player.UserName == credentials.UserName && player.Password == credentials.Password)
                {
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
            return Unauthorized();
        }


        [HttpPost("registration")]
        public IActionResult Registration([FromBody] RegisterDTO credentials)
        {
            if (credentials == null)
            {
                return BadRequest("Invalid client request");
            }

            var players = _playerRepository.GetPlayers();
            foreach (Player p in players)
            {
                if (p.UserName == credentials.UserName || p.Email == credentials.Email)
                {
                    return Conflict();
                }
            }



            Player player = new Player
            {
                FullName = credentials.FullName!,
                UserName = credentials.UserName!,
                Email = credentials.Email!,
                Password = credentials.Password!,
                Birthdate = credentials.Birthdate!
            };

            var role = _roleRepository.GetRoleByName("player");

            player.Roles.Add(role);

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
