import { Game } from "./game.model";
import { Player } from "./player.model";

export interface SavedGame
{
    savedGameId: number;
    gameId: number;
    gameState: string;
    game: Game;
    gameUrl: string;
    playerOneId: number;
    playerOne: Player;
    playerTwoId: number;
    playerTwo: Player;
}