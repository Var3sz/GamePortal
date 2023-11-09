using GamePortal.DTOs;
using GamePortal.Models;
using GamePortal.Repository;
using GamePortal.Service;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Data;
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
        private readonly ITokenService _tokenService;

        /* Do it more efficiently */
        private readonly GamePortalDbContext _gamePortalDbContext;

        public AuthController(IPlayerRepository playerRepository, IRoleRepository roleRepository,GamePortalDbContext gamePortalDbContext, ITokenService tokenService, ILogger<AuthController> logger)
        {
            _playerRepository = playerRepository;
            _roleRepository = roleRepository;
            _gamePortalDbContext = gamePortalDbContext;
            _tokenService = tokenService;
            _logger = logger;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDTO credentials)
        {
            /* Amennyiben üres a body, akkor BadRequest, egyébként ilyen nem lehet, mert van kliensoldali validáció, ez csak biztonság kedvéért */
            if (credentials == null) { return BadRequest("Invalid client request"); }

            Player player = _playerRepository.GetPlayerByUsernameAndPassword(credentials.UserName!, credentials.Password!);

            if (player is null) { return Unauthorized(); }

            if (player.UserName == "admin" && player.Password == "admin")
            {
                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, player.UserName),
                    new Claim(ClaimTypes.Role, "admin")
                };

                var accessToken = _tokenService.GenerateToken(claims);
                var refreshToken = _tokenService.GenerateRefreshToken();
                var tokenExpiryTime = DateTime.Now.AddDays(7);

                _playerRepository.UpdateRefreshToken(player.PlayerId, refreshToken, tokenExpiryTime);

                /* TODO: Do something with this */
                List<Role> roles = _gamePortalDbContext.Roles.Where(r => r.Players.Any(p => p.PlayerId == player.PlayerId)).ToList();
                List<int> roleIds = roles.Select(r => r.RoleId).ToList();

                return Ok(new AuthenticatedResponse { roleIds = roleIds, player = player, Token = accessToken, RefreshToken = refreshToken });
            }
            else
            {
                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, player.UserName),
                    new Claim(ClaimTypes.Role, "player")
                };

                var accessToken = _tokenService.GenerateToken(claims);
                var refreshToken = _tokenService.GenerateRefreshToken();
                var tokenExpiryTime = DateTime.Now.AddDays(7);

                _playerRepository.UpdateRefreshToken(player.PlayerId, refreshToken, tokenExpiryTime);

                /* TODO: Do something with this */
                List<Role> roles = _gamePortalDbContext.Roles.Where(r => r.Players.Any(p => p.PlayerId == player.PlayerId)).ToList();
                List<int> roleIds = roles.Select(r => r.RoleId).ToList();

                return Ok(new AuthenticatedResponse { roleIds = roleIds, player = player, Token = accessToken, RefreshToken = refreshToken });
            }
        }


        [HttpPost("registration")]
        public IActionResult Registration([FromBody] RegisterDTO credentials)
        {
            /* Amennyiben üres a body, akkor BadRequest, egyébként ilyen nem lehet, mert van kliensoldali validáció, ez csak biztonság kedvéért */
            if (credentials == null) { return BadRequest("Invalid client request"); }

            /* Query, hogy van-e ilyen felhasználó, ha igen, Conflict */
            var existingUser = _playerRepository.GetPlayerByUsernameAndPassword(credentials.UserName!, credentials.Password!);
            if (existingUser is not null) { return Conflict(); }
            
            /* Csinálunk új Player-t */
            Player player = new Player
            {
                FullName = credentials.FullName!,
                UserName = credentials.UserName!,
                Email = credentials.Email!,
                Password = credentials.Password!,
                Birthdate = credentials.Birthdate!
            };

            /* Elkérjük a sima Playerhez tartozó Role-t, mindig fixen Player */
            Role role = _roleRepository.GetRoleByName("player");

            /* Hozzáadjuk a Role-okhoz a kapott role-t, ezzel együtt a kapcsolat is létrejön */
            player.Roles.Add(role);

            /* Majd hozzáadjuk a player táblához az új játékost */

            var claims = new List<Claim> {
                new Claim(ClaimTypes.Name, player.UserName),
                new Claim(ClaimTypes.Role, role.Name)
            };

            var accessToken = _tokenService.GenerateToken(claims);
            var refreshToken = _tokenService.GenerateRefreshToken();
            var tokenExpiryTime = DateTime.Now.AddDays(7);

            player.RefreshToken = refreshToken;
            player.RefreshTokenExpiryTime = tokenExpiryTime;

            _playerRepository.InsertPlayer(player);

            /* TODO: Do something with this */
            List<Role> roles = _gamePortalDbContext.Roles.Where(r => r.Players.Any(p => p.PlayerId == player.PlayerId)).ToList();
            List<int> roleIds = roles.Select(r => r.RoleId).ToList();

            /* Visszatérünk egy custom response-al, ami tartalmazza a rolet, a playert, a tokent */
            return Ok(new AuthenticatedResponse { roleIds = roleIds, player = player, Token = accessToken, RefreshToken = refreshToken });
        }
    }
}
