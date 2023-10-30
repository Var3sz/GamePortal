import * as React from "react";
import { Container, Row, Col } from "react-bootstrap";
import WinnerModal from "../components/WinnerModal";
import Connect4Menu from "../components/Connect4/Connect4GameMenu";
import Player from "../enums/Player";
import GameState from "../enums/GameState";

const ROWS = 6;
const COLUMNS = 7;

// Board is represented az a player array
type Board = Player[];

// Initialize a new empty board
const initializeBoard = () => Array(42).fill(Player.None);

// Which player is on turn
const getCurrentPlayer = (player: Player) => {
  switch (player) {
      case Player.None:
          return "noPlayer";
      case Player.One:
          return "playerOne";
      case Player.Two:
          return "playerTwo";
      default:
          return "";
  }
}


// Find the lowest empty cell in a column, 
// because the circle need to go there,
// but we can click on the entire column
const findLowestEmptyCellInACol = (board: Board, column: number) => {
  for (let row = ROWS - 1; row >= 0; row--) {
      const index = row * COLUMNS + column;
      if (board[index] === Player.None) {
          return index;
      }
  }
  return -1; // Column is full
}

// Determining the next player who is on the move
const switchPlayer = (player: Player) => {
  return player === Player.One ? Player.Two : Player.One;
};


const checkForWin = (board: Board) => {
  const checkDirection = (startIdx: number, increment: number) => {
    const boardSlice = [
      board[startIdx],
      board[startIdx + increment],
      board[startIdx + increment * 2],
      board[startIdx + increment * 3]
    ];

    return checkWinningSlice(boardSlice);
  };

  // Check wins horizontally
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col <= COLUMNS - 4; col++) {
      const index = row * COLUMNS + col;
      const winningResult = checkDirection(index, 1);
      if (winningResult !== false) return winningResult;
    }
  }

  // Check wins vertically
  for (let row = 0; row <= ROWS - 4; row++) {
    for (let col = 0; col < COLUMNS; col++) {
      const index = row * COLUMNS + col;
      const winningResult = checkDirection(index, COLUMNS);
      if (winningResult !== false) return winningResult;
    }
  }

  // Check wins diagonally
  for (let row = 0; row <= ROWS - 4; row++) {
    for (let col = 0; col < COLUMNS; col++) {
      const index = row * COLUMNS + col;

      // Checks diagonal down-left
      if (col >= 3) {
        const winningResult = checkDirection(index, COLUMNS - 1);
        if (winningResult !== false) return winningResult;
      }

      // Checks diagonal down-right
      if (col <= COLUMNS - 4) {
        const winningResult = checkDirection(index, COLUMNS + 1);
        if (winningResult !== false) return winningResult;
      }
    }
  }

  if (board.includes(Player.None)) {
    return GameState.InProgress;
  } else {
    return GameState.Draw;
  }
};

const checkWinningSlice = (miniBoard: Player[]) => {
  if (miniBoard.some(cell => cell === Player.None)) return false;

  const [a, b, c, d] = miniBoard;

  if (a === b && b === c && c === d) {
    return b; // Return the winning player
  }

  return false; // No winner in this slice
};

interface Connect4Props {}

interface Connect4State {
  board: Board;
  playerTurn: Player;
  gameState: GameState | Player;
  isModalOpen: boolean;
}

// Connect 4 class for rendering the screen and for the game itself
class Connect4 extends React.Component<Connect4Props, Connect4State> {
  state: Connect4State = {
    board: initializeBoard(),
    playerTurn: Player.One,
    gameState: GameState.InProgress,
    isModalOpen: false
  };

  public handleOnClick(index: number) {
    const { gameState } = this.state;
  
    if (gameState !== GameState.InProgress) return;
  
    const column = index % 7;
  
    if (this.isColumnFull(column)) {
      return;
    }
  
    this.makeMove(column);
  }

  // Check if a column is full so that we can't click on it
  private isColumnFull(column: number) {
    const { board } = this.state;
    return board[column] !== Player.None;
  }

  public makeMove(column: number) {
    const { board, playerTurn } = this.state;

    const index = findLowestEmptyCellInACol(board, column);

    const newBoard = board.slice();
    newBoard[index] = playerTurn;

    const gameState = checkForWin(newBoard);

    this.setState({
        board: newBoard,
        playerTurn: switchPlayer(playerTurn),
        gameState
      }, 
      () => {
        if (this.state.gameState === GameState.PlayerOneWin || this.state.gameState === GameState.PlayerTwoWin) {
          this.openModal(); // Open the modal when a player wins
        }
      }
    );
  }

  private openModal = () => {
    this.setState({isModalOpen: true})
  }

  private closeModal = () => {
    this.setState({isModalOpen: false})
  }


  // Cella renderelése a játékosnak megfelelően
  public renderCells = () => {
    const { board } = this.state;
    return board.map((player, index) => this.renderCell(player, index));
  };

  public renderCell(player: Player, index: number) {
    const isDropped = player !== Player.None;
  
    return (
      <Container
        className={`cell ${isDropped ? "circle-drop" : ""}`}
        key={index}
        onClick={() => this.handleOnClick(index)}
        data-player={getCurrentPlayer(player)}
      />
    );
  }

  public renderGameStatus = () => {
    const { gameState } = this.state

    let text

    switch (gameState) {
      case GameState.InProgress:
        text = 'Game is in progress';
        break;
      case GameState.Draw:
        text = 'Game is a draw';
        break;
      case GameState.PlayerOneWin:
        text = 'PlayerOne won';
        break;
      case GameState.PlayerTwoWin: 
        text = 'PlayerTwo won';
        break;
      default:
        break;
    }

    return <Container> {text} </Container>
  }

  public render() {
    const { isModalOpen, gameState } = this.state;
  
    return (
      <Container className="Connect4">
        <Row>
          <Col lg={3} className="side-menu mt-3">
            <Connect4Menu 
              renderGameStatus={this.renderGameStatus()} 
              currentPlayer={this.state.playerTurn === Player.One ? "Yellow" : "Red"} 
            />
          </Col>
          <Col lg={9} className="board-container mt-3">
            <Container id="board"> {this.renderCells()} </Container>
          </Col>
        </Row>
  
        {gameState === GameState.PlayerOneWin || gameState === GameState.PlayerTwoWin ? (
          <WinnerModal
            show={isModalOpen}
            onClose={this.closeModal}
            winnerName={gameState === GameState.PlayerOneWin ? 'Player One' : 'Player Two'}
          />
        ) : null}
      </Container>
    );
  }
}

export default Connect4;