import { Piece, GameState } from "./connect4.enums";
import { ROWS, COLUMNS, BOARD_SIZE } from "./connect4.constants";

// Initialize board
export const createBoard = () => Array(BOARD_SIZE).fill(Piece.None);

// Returns the current player
export const getCurrentColor = (piece: Piece) => {
    const playerClassMap = {
        [Piece.None]: "none",
        [Piece.Yellow]: "yellow",
        [Piece.Red]: "red",
    };

    return playerClassMap[piece] || "";
};

/* Determine next player */
export const nextColor = (piece: Piece) => (piece === Piece.Yellow ? Piece.Red : Piece.Yellow);

/* Find lowest empty cell in a column */
export const findEmptyCell = (board: Piece[], columnIndex: number) => {
    for (let row = ROWS - 1; row >= 0; row--) {
        const index = calculateIndex(row, columnIndex);
        if (board[index] === Piece.None) {
            return index;
        }
    }
    return -1;
}

/* Check for win */
export const checkForWin = (board: Piece[]) => {
  const checkDirection = (startIdx: number, increment: number) => {
    const boardSlice = Array.from({ length: 4 }, (_, i) => board[startIdx + i * increment]);
    return checkWinningSlice(boardSlice);
  };

  const checkDirectionRange = (startRow: number, endRow: number, startCol: number, endCol: number, increment: number) => {
    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        const index = calculateIndex(row, col);
        const winningResult = checkDirection(index, increment);
        if (winningResult !== false) return winningResult;
      }
    }
    return false;
  };

  // Check wins horizontally
  const horizontalResult = checkDirectionRange(0, ROWS - 1, 0, COLUMNS - 4, 1);
  if (horizontalResult !== false) return horizontalResult;

  // Check wins vertically
  const verticalResult = checkDirectionRange(0, ROWS - 4, 0, COLUMNS - 1, COLUMNS);
  if (verticalResult !== false) return verticalResult;

  // Check wins diagonally
  const diagonalResultDownLeft = checkDirectionRange(0, ROWS - 4, 3, COLUMNS - 1, COLUMNS - 1);
  if (diagonalResultDownLeft !== false) return diagonalResultDownLeft;

  const diagonalResultDownRight = checkDirectionRange(0, ROWS - 4, 0, COLUMNS - 4, COLUMNS + 1);
  if (diagonalResultDownRight !== false) return diagonalResultDownRight;

  return board.includes(Piece.None) ? GameState.InProgress : GameState.Draw;
};

/*********************** Helper functions which are used in place *******************************/

const checkWinningSlice = (boardSegment: Piece[]) => {
  if (boardSegment.some(cell => cell === Piece.None)) return false;  
  const [a, b, c, d] = boardSegment;
  return a === b && b === c && c === d ? b : false;                  
};

const calculateIndex = (row: number, col: number) => row * COLUMNS + col;