using GamePortal.DTOs;
using GamePortal.Models;
using GamePortal.Repository;
using GamePortal.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Numerics;

namespace GamePortal.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TokenController : ControllerBase
    {
        private readonly GamePortalDbContext _gamePortalDbContext;
        private readonly ITokenService _tokenService;
        private readonly IPlayerRepository _playerRepository;
        private readonly ILogger<TokenController> _logger;


        public TokenController(
                GamePortalDbContext gamePortalDbContext,
                ITokenService tokenService,
                IPlayerRepository playerRepository,
                ILogger<TokenController> logger
            ) 
        {
            _gamePortalDbContext = gamePortalDbContext;
            _tokenService = tokenService;
            _playerRepository = playerRepository;
            _logger = logger;
        }


        [HttpPost]
        [Route("refresh")]
        public IActionResult Refresh([FromBody] TokenDTO token)
        {
            if (token is null) { return BadRequest("Invalid client request"); }

            string accessToken = token.AccessToken!;
            string refreshToken = token.RefreshToken!;

            var principal = _tokenService.GetPrincipalFromExpiredToken(accessToken);
            var userName = principal.Identity!.Name;

            var player = _playerRepository.GetPlayerByUsername(userName!);

            if (player is null || player.RefreshToken != refreshToken || player.RefreshTokenExpiryTime <=  DateTime.Now)
            {
                return BadRequest("Invalid client request");
            }

            var newAccessToken = _tokenService.GenerateToken(principal.Claims);
            var newRefreshToken = _tokenService.GenerateRefreshToken();
            var newExpiryTime = DateTime.Now.AddMinutes(5);

            _playerRepository.UpdateRefreshToken(player.PlayerId, newRefreshToken, newExpiryTime);


            /* TODO: Do something with this */
            List<Role> roles = _gamePortalDbContext.Roles.Where(r => r.Players.Any(p => p.PlayerId == player.PlayerId)).ToList();
            List<int> roleIds = roles.Select(r => r.RoleId).ToList();

            return Ok(new AuthenticatedResponse { roleIds = roleIds, player = player, Token = newAccessToken, RefreshToken = newRefreshToken });
        }

        [HttpPost]
        [Route("revoke")]
        public IActionResult Revoke()
        {
            var userName = User.Identity!.Name;
            var user = _playerRepository.GetPlayerByUsername(userName!);
            if (user is null) { return BadRequest(); }

            user.RefreshToken = null;
            _gamePortalDbContext.SaveChanges();

            return NoContent();
        }
    }
}
