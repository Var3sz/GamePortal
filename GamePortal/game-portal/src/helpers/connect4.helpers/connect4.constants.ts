import { GameState, Piece } from "./connect4.enums";
import { createBoard } from "./connect4.functions";
import { Connect4State } from "./connect4.interfaces";

export const ROWS = 6;
export const COLUMNS = 7;
export const BOARD_SIZE = ROWS * COLUMNS;

export const defaultBoard: Connect4State = {
    board: createBoard(),
    playerTurn: Piece.Yellow,
    gameState: GameState.InProgress,
    isModalOpen: false
};