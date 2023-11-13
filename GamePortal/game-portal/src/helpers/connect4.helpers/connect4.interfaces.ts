import { Piece, GameState } from "./connect4.enums";

export interface Connect4State {
  board: Piece[];
  playerTurn: Piece;
  gameState: GameState | Piece;
  isModalOpen: boolean;
}