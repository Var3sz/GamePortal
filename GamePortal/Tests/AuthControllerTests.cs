using GamePortal.Controllers;
using GamePortal.DTOs;
using GamePortal.Models;
using GamePortal.Repository;
using GamePortal.Response;
using GamePortal.Service;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Security.Claims;
using Xunit;

namespace GamePortal.Tests
{
  public class AuthControllerTests
  {
    [Fact]
    public void Registration_ValidCredentials_ReturnsOk()
    {
      var mockPlayerRepository = new Mock<IPlayerRepository>();
      var mockRoleRepository = new Mock<IRoleRepository>();
      var mockTokenService = new Mock<ITokenService>();

      var controller = new AuthController(mockPlayerRepository.Object, mockRoleRepository.Object, mockTokenService.Object);

      var registerDTO = new RegisterDTO
      {
        UserName = "testuser",
        Password = "testpassword",
        FullName = "Test User",
        Email = "testuser@example.com",
        Birthdate = new DateTime(1990, 1, 1)
      };

      var mockRole = new Role { Name = "player" };
      mockRoleRepository.Setup(r => r.GetRoleByName("player")).Returns(mockRole);

      mockPlayerRepository.Setup(r => r.GetPlayerByUsernameAndPassword(It.IsAny<string>(), It.IsAny<string>()))
                         .Returns((Player)null);

      mockTokenService.Setup(t => t.GenerateToken(It.IsAny<List<Claim>>())).Returns("fakeAccessToken");
      mockTokenService.Setup(t => t.GenerateRefreshToken()).Returns("fakeRefreshToken");

      var result = controller.Registration(registerDTO) as OkObjectResult;

      Assert.NotNull(result);
      Assert.Equal(200, result.StatusCode);

      var authenticatedResponse = result.Value as AuthenticatedResponse;
      Assert.NotNull(authenticatedResponse);

      Assert.Equal("fakeAccessToken", authenticatedResponse.Token);
      Assert.Equal("fakeRefreshToken", authenticatedResponse.RefreshToken);
      Assert.Equal("testuser", authenticatedResponse.player.UserName);
    }

    [Fact]
    public void Login_ValidCredentials_ReturnsOk()
    {
      // Arrange
      var mockPlayerRepository = new Mock<IPlayerRepository>();
      var mockRoleRepository = new Mock<IRoleRepository>();
      var mockTokenService = new Mock<ITokenService>();

      var controller = new AuthController(mockPlayerRepository.Object, mockRoleRepository.Object, mockTokenService.Object);

      var loginDTO = new LoginDTO
      {
        UserName = "testuser",
        Password = "testpassword",
      };

      var mockPlayer = new Player
      {
        PlayerId = 1,
        UserName = "testuser",
        FullName = "Test User",
        Email = "testuser@example.com",
        Birthdate = new DateTime(1990, 1, 1)
      };

      mockPlayerRepository.Setup(r => r.GetPlayerByUsernameAndPassword(It.IsAny<string>(), It.IsAny<string>()))
                         .Returns(mockPlayer);

      mockTokenService.Setup(t => t.GenerateToken(It.IsAny<List<Claim>>())).Returns("fakeAccessToken");
      mockTokenService.Setup(t => t.GenerateRefreshToken()).Returns("fakeRefreshToken");

      var result = controller.Login(loginDTO) as OkObjectResult;

      Assert.NotNull(result);
      Assert.Equal(200, result.StatusCode);

      var authenticatedResponse = result.Value as AuthenticatedResponse;
      Assert.NotNull(authenticatedResponse);

      Assert.Equal("fakeAccessToken", authenticatedResponse.Token);
      Assert.Equal("fakeRefreshToken", authenticatedResponse.RefreshToken);
      Assert.Equal("testuser", authenticatedResponse.player.UserName);
    }

  }
}
