﻿using GamePortal.DTOs;
using GamePortal.Models;
using GamePortal.Repository;
using GamePortal.Service;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Runtime.Serialization;
using System.Security.Claims;
using System.Text;

namespace GamePortal.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly GamePortalDbContext _gamePortalDbContext;
        private readonly IPlayerRepository _playerRepository;
        private readonly IRoleRepository _roleRepository;
        private readonly ITokenService _tokenService;
        private readonly ILogger<AuthController> _logger;


        public AuthController(IPlayerRepository playerRepository, 
            IRoleRepository roleRepository,
            GamePortalDbContext gamePortalDbContext, 
            ITokenService tokenService, 
            ILogger<AuthController> logger
        )
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
            if (credentials == null) { return BadRequest("Invalid client request"); }

            Player player = _playerRepository.GetPlayerByUsernameAndPassword(credentials.UserName!, credentials.Password!);

            if (player is null) { return Unauthorized(); }

            var roleIds = _roleRepository.GetRoleIdsByPlayerId(player.PlayerId);

            /* Admin role is 1 */
            if (roleIds.Contains(1))
            {
                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, player.UserName),
                    new Claim(ClaimTypes.Role, "admin")
                };

                var accessToken = _tokenService.GenerateToken(claims);
                var refreshToken = _tokenService.GenerateRefreshToken();
                var tokenExpiryTime = DateTime.Now.AddMinutes(5);

                _playerRepository.UpdateRefreshToken(player.PlayerId, refreshToken, tokenExpiryTime);

                return Ok(new AuthenticatedResponse { roleIds = roleIds, Token = accessToken, RefreshToken = refreshToken });
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
                var tokenExpiryTime = DateTime.Now.AddMinutes(5);

                _playerRepository.UpdateRefreshToken(player.PlayerId, refreshToken, tokenExpiryTime);

                return Ok(new AuthenticatedResponse { roleIds = roleIds, Token = accessToken, RefreshToken = refreshToken });
            }
        }


        [HttpPost("registration")]
        public IActionResult Registration([FromBody] RegisterDTO credentials)
        {
            if (credentials == null) { return BadRequest("Invalid client request"); }

            var existingUser = _playerRepository.GetPlayerByUsernameAndPassword(credentials.UserName!, credentials.Password!);
            if (existingUser is not null) { return Conflict(); }
            
            Player player = new Player
            {
                FullName = credentials.FullName!,
                UserName = credentials.UserName!,
                Email = credentials.Email!,
                Password = credentials.Password!,
                Birthdate = credentials.Birthdate!
            };

            Role role = _roleRepository.GetRoleByName("player");

            player.Roles.Add(role);

            var claims = new List<Claim> {
                new Claim(ClaimTypes.Name, player.UserName),
                new Claim(ClaimTypes.Role, role.Name)
            };

            var accessToken = _tokenService.GenerateToken(claims);
            var refreshToken = _tokenService.GenerateRefreshToken();
            var tokenExpiryTime = DateTime.Now.AddMinutes(5);

            player.RefreshToken = refreshToken;
            player.RefreshTokenExpiryTime = tokenExpiryTime;

            _playerRepository.InsertPlayer(player);

            var roleIds = _roleRepository.GetRoleIdsByPlayerId(player.PlayerId);

            return Ok(new AuthenticatedResponse { roleIds = roleIds, Token = accessToken, RefreshToken = refreshToken });
        }
    }
}
