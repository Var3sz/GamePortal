using GamePortal.DTOs;
using GamePortal.Models;
using GamePortal.Repository;
using GamePortal.Response;
using GamePortal.Service;
using Microsoft.AspNetCore.Mvc;

namespace GamePortal.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TokenController : ControllerBase
    {
        private readonly GamePortalDbContext _gamePortalDbContext;
        private readonly ITokenService _tokenService;
        private readonly IPlayerRepository _playerRepository;
        private readonly IRoleRepository _roleRepository;
        private readonly ILogger<TokenController> _logger;

        public TokenController(
                GamePortalDbContext gamePortalDbContext,
                ITokenService tokenService,
                IPlayerRepository playerRepository,
                IRoleRepository roleRepository,
                ILogger<TokenController> logger
            ) 
        {
            _gamePortalDbContext = gamePortalDbContext;
            _tokenService = tokenService;
            _playerRepository = playerRepository;
            _roleRepository = roleRepository;
            _logger = logger;
        }

        /*
         * Source: https://code-maze.com/using-refresh-tokens-in-asp-net-core-authentication/ 
         */
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


            return Ok(new AuthenticatedResponse { player = player, Token = newAccessToken, RefreshToken = newRefreshToken });
        }
    }
}
