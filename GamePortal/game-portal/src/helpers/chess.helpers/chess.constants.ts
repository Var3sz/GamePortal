import { Board } from "../../models/chess/Board";

/** Horizontal and vertical axis **/
export const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
export const COLS = ['1', '2', '3', '4', '5', '6', '7', '8'];

/** The width and height of one tile on the chessboard **/
export const TILE_SIZE = 75;

/** Initialize default Chess board **/
export const defaultBoard: Board = Board.fromFEN("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq 1 n");

/** Promotion lines **/
export const WHITE_PROMOTION_ROW = 7;
export const BLACK_PROMOTION_ROW = 0;

/** REFEREE CONSTANTS */
export const WHITE_PAWN_STARTING_ROW = 1;      // White pawn starting row
export const BLACK_PAWN_STARTING_ROW = 6;      // Black pawn starting row
export const UP = 1;      // Moving direction: UP
export const DOWN = -1;   // Moving direction: DOWN
export const RIGHT = 1;   // Moving direction: RIGHT
export const LEFT = -1;   // Moving direction: LEFT
