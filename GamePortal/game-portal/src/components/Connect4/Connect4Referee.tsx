import '../../css-files/connect4.css'
import { useState, useEffect } from 'react';
import { Container, Row, Col } from "react-bootstrap";
import { Piece, GameState } from "../../helpers/connect4.helpers/connect4.enums";
import { getCurrentColor, nextColor, findEmptyCell, checkForWin, createBoard } from '../../helpers/connect4.helpers/connect4.functions';
import { Connect4State } from '../../helpers/connect4.helpers/connect4.interfaces';
import WinnerModal from "../WinnerModal";
import Connect4Menu from "./Connect4GameMenu";
import Connect4Connector from '../../connection/connect4.connector';

interface Connect4MultiProps {
  isMultiplayer: boolean;
}

const defaultBoard: Connect4State = {
  board: createBoard(),
  playerTurn: Piece.Yellow,
  gameState: GameState.InProgress,
  isModalOpen: false,
};

export const Connect4Referee: React.FC<Connect4MultiProps> = ({ isMultiplayer }) => {
  const [state, setState] = useState<Connect4State>(defaultBoard);  // GameState

  const { sendBoardState, events } = Connect4Connector();


  // Hook for opening WinnerModal
  useEffect(() => {
    if (state.gameState === GameState.PlayerOneWin || state.gameState === GameState.PlayerTwoWin) {
      manageWinnerModal();
    }
  }, [state.gameState]);

  useEffect(() => {
    if (isMultiplayer) {
      events((boardState) => {
        const parsedBoardState = JSON.parse(boardState);
        setState({
          ...state,
          board: parsedBoardState,
          playerTurn: nextColor(state.playerTurn),
          gameState: checkForWin(parsedBoardState),
        });
      });
    }
  }, [isMultiplayer, state]);


  /* Handling onClick */
  const handleOnClick = (index: number) => {
    if (state.gameState === GameState.InProgress && !isColumnFull(index % 7)) {
      makeMove(index % 7);
    }
  };

  /* Get the state of the board for multiplayer */
  const getBoardString = (board: Piece[]) => JSON.stringify(board);

  /* Determine is a colum is full */
  const isColumnFull = (column: number) => state.board[column] !== Piece.None;

  /* Making a move */
  const makeMove = (column: number) => {
    const index = findEmptyCell(state.board, column);
    const newBoard = [...state.board];
    newBoard[index] = state.playerTurn;

    if (isMultiplayer) {
      const boardString = getBoardString(newBoard);
      console.log(boardString);
      sendBoardState(boardString);
    }

    setState({
      ...state,
      board: newBoard,
      playerTurn: nextColor(state.playerTurn),
      gameState: checkForWin(newBoard),
    });
  };

  /* Managing winner modal */
  const manageWinnerModal = () => {
    setState(prevState => ({
      ...prevState,
      isModalOpen: !prevState.isModalOpen
    }));
  };

  /* Rendering cells */
  const renderCells = () => state.board.map((player, index) => renderCell(player, index));

  /* Render one cell */
  const renderCell = (player: Piece, index: number) => {
    return (
      <Container
        className={`cell ${player !== Piece.None ? "circle-drop" : ""}`}
        key={index}
        onClick={() => handleOnClick(index)}
        data-player={getCurrentColor(player)}
      />
    )
  };

  /* Render the status of the game */
  const renderGameStatus = () => {
    const { gameState } = state;
    const statusText = {
      [GameState.InProgress]: 'Game is in progress',
      [GameState.Draw]: 'Game is a draw',
      [GameState.PlayerOneWin]: 'PlayerOne won',
      [GameState.PlayerTwoWin]: 'PlayerTwo won',
    }[gameState];

    return <Container>{statusText}</Container>;
  };

  return (
    <Container className="Connect4">
      <Row>
        <Col lg={3} className="side-menu mt-3">
          <Connect4Menu
            renderGameStatus={renderGameStatus()}
            currentPlayer={state.playerTurn === Piece.Yellow ? "Yellow" : "Red"}
          />
        </Col>
        <Col lg={9} className="board-container mt-3">
          <Container id="board"> {renderCells()} </Container>
        </Col>
      </Row>

      {state.gameState === GameState.PlayerOneWin || state.gameState === GameState.PlayerTwoWin ? (
        <WinnerModal
          show={state.isModalOpen}
          onClose={manageWinnerModal}
          winnerName={state.gameState === GameState.PlayerOneWin ? 'Player One' : 'Player Two'}
        />
      ) : <></>}
    </Container>
  );
};

export default Connect4Referee;