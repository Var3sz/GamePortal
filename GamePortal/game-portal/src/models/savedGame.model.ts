import { Game } from "./game.model";
import { Player } from "./player.model";

export interface SavedGame
{
    savedgameId: number;
    gameId: number;
    gameState: string;
    game: Game;
    playerOneId: number;
    playerOne: Player;
    playerTwoId: number;
    playerTwo: Player;
}