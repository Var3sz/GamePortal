import { PieceType, PieceColor } from "../enums/ChessEnums";
import { Board } from "../models/chess/Board";
import { Pawn } from "../models/chess/Pawn";
import { Piece } from "../models/chess/Pieces";
import { Position } from "../models/chess/Position";
import Chess from "../pages/Chess";

/** CHESSBOARD CONSTANTS **/

/** Horizontal and vertical axis **/
export const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
export const COLS = ['1', '2', '3', '4', '5', '6', '7', '8'];

/** The width and height of one tile on the chessboard **/
export const TILE_SIZE = 75;

/** Initialize default Chess board **/
export const defaultBoard: Board = new Board([
    // black pieces
    new Piece(new Position(0, 7), PieceType.ROOK, PieceColor.BLACK, false),
    new Piece(new Position(1, 7), PieceType.KNIGHT, PieceColor.BLACK, false),
    new Piece(new Position(2, 7), PieceType.BISHOP, PieceColor.BLACK, false),
    new Piece(new Position(3, 7), PieceType.QUEEN, PieceColor.BLACK, false),
    new Piece(new Position(4, 7), PieceType.KING, PieceColor.BLACK, false),
    new Piece(new Position(5, 7), PieceType.BISHOP, PieceColor.BLACK, false),
    new Piece(new Position(6, 7), PieceType.KNIGHT, PieceColor.BLACK, false),
    new Piece(new Position(7, 7), PieceType.ROOK, PieceColor.BLACK, false),

    new Pawn(new Position(0, 6), PieceColor.BLACK, false),
    new Pawn(new Position(1, 6), PieceColor.BLACK, false),
    new Pawn(new Position(2, 6), PieceColor.BLACK, false),
    new Pawn(new Position(3, 6), PieceColor.BLACK, false),
    new Pawn(new Position(4, 6), PieceColor.BLACK, false),
    new Pawn(new Position(5, 6), PieceColor.BLACK, false),
    new Pawn(new Position(6, 6), PieceColor.BLACK, false),
    new Pawn(new Position(7, 6), PieceColor.BLACK, false),

    // white pieces
    new Piece(new Position(0, 0), PieceType.ROOK, PieceColor.WHITE, false),
    new Piece(new Position(1, 0), PieceType.KNIGHT, PieceColor.WHITE, false),
    new Piece(new Position(2, 0), PieceType.BISHOP, PieceColor.WHITE, false),
    new Piece(new Position(3, 0), PieceType.QUEEN, PieceColor.WHITE, false),
    new Piece(new Position(4, 0), PieceType.KING, PieceColor.WHITE, false),
    new Piece(new Position(5, 0), PieceType.BISHOP, PieceColor.WHITE, false),
    new Piece(new Position(6, 0), PieceType.KNIGHT, PieceColor.WHITE, false),
    new Piece(new Position(7, 0), PieceType.ROOK, PieceColor.WHITE, false),

    new Pawn(new Position(0, 1), PieceColor.WHITE, false),
    new Pawn(new Position(1, 1), PieceColor.WHITE, false),
    new Pawn(new Position(2, 1), PieceColor.WHITE, false),
    new Pawn(new Position(3, 1), PieceColor.WHITE, false),
    new Pawn(new Position(4, 1), PieceColor.WHITE, false),
    new Pawn(new Position(5, 1), PieceColor.WHITE, false),
    new Pawn(new Position(6, 1), PieceColor.WHITE, false),
    new Pawn(new Position(7, 1), PieceColor.WHITE, false),
], 1);

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
