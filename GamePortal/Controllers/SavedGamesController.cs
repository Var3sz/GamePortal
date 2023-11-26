using GamePortal.DTOs;
using GamePortal.Models;
using GamePortal.Repository;
using Microsoft.AspNetCore.Mvc;

namespace GamePortal.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SavedGamesController : ControllerBase
    {
        private readonly ISavedGamesRepository _savedGamesRepository;
        private readonly IPlayerRepository _playerRepository;
        private readonly IGameRepository _gameRepository;

        public SavedGamesController(ISavedGamesRepository savedGamesRepository , IPlayerRepository playerRepository, IGameRepository gameRepository)
        {
            _savedGamesRepository = savedGamesRepository;
            _playerRepository = playerRepository;
            _gameRepository = gameRepository;
        }

        [HttpGet]
        [Route("games/{playerId}")]
        public List<SavedGame> GetSavedGamesByPlayerId(int playerId)
        {
            List<SavedGame> savedGames = _savedGamesRepository.GetSavedGamesByPlayerId(playerId);

            if (savedGames == null || savedGames.Count == 0)
            {
                return null;
            }

            return savedGames;
        }

        [HttpGet]
        [Route("game/{savedGameId}")]
        public SavedGame GetSavedGameById(int savedGameId)
        {
            SavedGame savedGame = _savedGamesRepository.GetSavedGame(savedGameId);

            if (savedGame == null)
            {
                return null;
            }

            return savedGame;
        }

        [HttpPost]
        public ActionResult InsertSavedGame([FromBody] SavedGameDTO savedGame)
        {
            if (savedGame == null) { return BadRequest("Invalid request body"); }

            SavedGame newSavedGame = new SavedGame
            {
                GameId = savedGame.GameId,
                GameUrl = savedGame.GameUrl,
                GameState = savedGame.GameState,
                PlayerOneId = savedGame.PlayerOneId,
                PlayerTwoId = savedGame.PlayerTwoId
            };

            Game game = _gameRepository.GetGameById(savedGame.GameId);
            Player playerOne = _playerRepository.GetPlayerById(savedGame.PlayerOneId);
            Player playerTwo = _playerRepository.GetPlayerById(savedGame.PlayerTwoId);
            
            newSavedGame.Game = game;
            newSavedGame.PlayerOne = playerOne;
            newSavedGame.PlayerTwo = playerTwo;

            _savedGamesRepository.InsertSavedGame(newSavedGame);

            return CreatedAtAction(nameof(GetSavedGameById), new { savedGameId = newSavedGame.SavedGameId }, newSavedGame);
        }

        [HttpPut]
        [Route("savedgame/{savedGameId}")]
        public IActionResult UpdateSavedGame(int savedGameId, [FromBody] SavedGameDTO savedGame)
        {
            if (savedGame == null)
            {
                return BadRequest("Invalid request body");
            }

            SavedGame existing = _savedGamesRepository.GetSavedGame(savedGameId);
            
            if (existing == null)
            {
                return NotFound("Saved game not found");
            }

            existing.GameState = savedGame.GameState;

            _savedGamesRepository.UpdateSavedGame(existing);

            return NoContent();
        }
    }
}
