using Xunit;
using Moq;
using GamePortal.Controllers;
using GamePortal.Repository;
using GamePortal.Models;
using GamePortal.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace GamePortal.Tests
{
  public class SavedGamesControllerTests
  {
    [Fact]
    public void GetSavedGamesByPlayerId_ReturnsSavedGames()
    {
      var mockSavedGamesRepository = new Mock<ISavedGamesRepository>();
      var mockGameRepository = new Mock<IGameRepository>();
      var mockPlayerRepository = new Mock<IPlayerRepository>();
      var controller = new SavedGamesController(mockSavedGamesRepository.Object, mockPlayerRepository.Object, mockGameRepository.Object);

      var playerOneId = 1;
      var playerTwoId = 2;
      var gameId = 1;

      Player playerOne = new Player
      {
        PlayerId = playerOneId,
        // Set other properties as needed
      };

      Player playerTwo = new Player
      {
        PlayerId = playerTwoId,
        // Set other properties as needed
      };

      // Create Game instance
      Game game = new Game
      {
        GameId = gameId,
        // Set other properties as needed
      };

      List<SavedGame> expectedSavedGames = new List<SavedGame>
      {
          new SavedGame
          {
              GameId = gameId,
              GameUrl = "dummy1",
              GameState = "dummy1",
              PlayerOneId = playerOneId,
              PlayerTwoId = playerTwoId,
              Game = game,
              PlayerOne = playerOne,
              PlayerTwo = playerTwo
          },
          new SavedGame
          {
              GameId = gameId,
              GameUrl = "dummy2",
              GameState = "dummy2",
              PlayerOneId = playerOneId,
              PlayerTwoId = playerTwoId,
              Game = game,
              PlayerOne = playerOne,
              PlayerTwo = playerTwo
          }
      };
      mockSavedGamesRepository.Setup(r => r.GetSavedGamesByPlayerId(playerOneId)).Returns(expectedSavedGames);

      var result = controller.GetSavedGamesByPlayerId(playerTwoId) as List<SavedGame>;

      Assert.NotNull(result);
      Assert.Equal(expectedSavedGames, result);
    }

    [Fact]
    public void InsertSavedGame_ReturnsCreatedAtAction()
    {
      var mockSavedGamesRepository = new Mock<ISavedGamesRepository>();
      var mockGameRepository = new Mock<IGameRepository>();
      var mockPlayerRepository = new Mock<IPlayerRepository>();
      var controller = new SavedGamesController(mockSavedGamesRepository.Object, mockPlayerRepository.Object, mockGameRepository.Object);

      var savedGameDTO = new SavedGameDTO { /* Set required properties here */ };
      var expectedSavedGameId = 1;
      var expectedSavedGame = new SavedGame { SavedGameId = expectedSavedGameId };

      mockGameRepository.Setup(r => r.GetGameById(savedGameDTO.GameId)).Returns(new Game());
      mockPlayerRepository.Setup(r => r.GetPlayerById(savedGameDTO.PlayerOneId)).Returns(new Player());
      mockPlayerRepository.Setup(r => r.GetPlayerById(savedGameDTO.PlayerTwoId)).Returns(new Player());
      mockSavedGamesRepository.Setup(r => r.InsertSavedGame(It.IsAny<SavedGame>())).Callback((SavedGame savedGame) =>
      {
        savedGame.SavedGameId = expectedSavedGameId;
      });

      var result = controller.InsertSavedGame(savedGameDTO) as CreatedAtActionResult;
      var createdSavedGame = result.Value as SavedGame;

      Assert.NotNull(result);
      Assert.Equal(nameof(SavedGamesController.GetSavedGameById), result.ActionName);
      Assert.Equal(expectedSavedGameId, result.RouteValues["savedGameId"]);
      Assert.Equal(expectedSavedGame, createdSavedGame);
    }

    [Fact]
    public void UpdateSavedGame_ReturnsNoContent()
    {
      var mockSavedGamesRepository = new Mock<ISavedGamesRepository>();
      var mockGameRepository = new Mock<IGameRepository>();
      var mockPlayerRepository = new Mock<IPlayerRepository>();
      var controller = new SavedGamesController(mockSavedGamesRepository.Object, mockPlayerRepository.Object, mockGameRepository.Object);

      var savedGameId = 1;
      var savedGameDTO = new SavedGameDTO { /* Set required properties here */ };
      var existingSavedGame = new SavedGame { SavedGameId = savedGameId };

      mockSavedGamesRepository.Setup(r => r.GetSavedGame(savedGameId)).Returns(existingSavedGame);

      var result = controller.UpdateSavedGame(savedGameId, savedGameDTO) as NoContentResult;

      Assert.NotNull(result);
      Assert.Equal(204, result.StatusCode);
    }
  }
}
