using GamePortal.Controllers;
using GamePortal.Models;
using GamePortal.Repository;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Security.Claims;
using Xunit;

namespace GamePortal.Tests
{
    public class PlayerControllerTests
    {
        [Fact]
        public void GetPlayers_ReturnsPlayers()
        {
            // Arrange
            var playerRepositoryMock = new Mock<IPlayerRepository>();
            var savedGamesRepositoryMock = new Mock<ISavedGamesRepository>();

            var playersController = new PlayersController(playerRepositoryMock.Object, savedGamesRepositoryMock.Object);

            var expectedPlayers = new List<Player>
            {
                new Player { PlayerId = 1, UserName = "Player1" },
                new Player { PlayerId = 2, UserName = "Player2" }
            };

            playerRepositoryMock.Setup(repo => repo.GetPlayers())
                .Returns(expectedPlayers);

            var result = playersController.GetPlayers();

            Assert.NotNull(result);
            Assert.Equal(expectedPlayers, result);
        }

        [Fact]
        public void RemovePlayer_AdminRole_RemovesPlayerAndSavedGames()
        {
            var playerRepositoryMock = new Mock<IPlayerRepository>();
            var savedGamesRepositoryMock = new Mock<ISavedGamesRepository>();

            var playersController = new PlayersController(playerRepositoryMock.Object, savedGamesRepositoryMock.Object);

            var adminUser = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.Name, "admin"),
                new Claim(ClaimTypes.Role, "admin"),
            }));

            playersController.ControllerContext = new ControllerContext()
            {
                HttpContext = new DefaultHttpContext() { User = adminUser }
            };

            var playerToRemove = new Player { PlayerId = 1, UserName = "PlayerToRemove" };

            playersController.RemovePlayer(playerToRemove);

            playerRepositoryMock.Verify(repo => repo.RemovePlayer(playerToRemove), Times.Once);
            savedGamesRepositoryMock.Verify(repo => repo.RemoveSavedGame(playerToRemove.PlayerId), Times.Once);
        }

    }
}
