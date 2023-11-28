import '../../css-files/connect4.css'
import { useState, useEffect, useMemo } from 'react';
import { Piece, GameState } from "../../helpers/connect4.helpers/connect4.enums";
import { Container, Box, Grid, GridItem } from '@chakra-ui/react';
import { getCurrentColor, nextColor, findEmptyCell, checkForWin, createBoard } from '../../helpers/connect4.helpers/connect4.functions';
import { Connect4State } from '../../helpers/connect4.helpers/connect4.interfaces';
import WinnerModal from "./WinnerModal";
import Connect4Menu from "./Connect4GameMenu";
import ChessConnector from '../../connection/chess.connector';
import { SavedGame } from '../../models/savedGame.model';
import axios from '../../api/axios';
import useAuth from '../../auth/useAuth';

interface Connect4MultiProps {
  isMultiplayer: boolean;
  isNewGame?: boolean;
  savedGame?: SavedGame;
}

const defaultBoard: Connect4State = {
  board: createBoard(),
  playerTurn: Piece.Yellow,
  gameState: GameState.InProgress,
  isModalOpen: false,
};

export const Connect4Referee: React.FC<Connect4MultiProps> = ({ isMultiplayer, isNewGame, savedGame }) => {
  const [state, setState] = useState<Connect4State>(defaultBoard);  // GameState
  const { auth } = useAuth();
  const { savedGameId, gameUrl, gameState, playerOne, playerTwo } = savedGame || {};
  const chessConnector = useMemo(() => {
    if (gameUrl) {
      return ChessConnector(auth.player.userName, gameUrl);
    } else {
      return {
        chessEvents: () => { },
        connect4Events: () => { },
        sendFEN: () => { },
        sendBoardState: () => { }
      };
    }
  }, [auth.player.userName, gameUrl]);

  const { connect4Events, sendBoardState } = chessConnector;

  let enemy: string;

  if (playerOne && playerTwo) {
    if (auth.player.userName === playerOne.userName) {
      enemy = playerTwo.userName;
    } else {
      enemy = playerOne.userName;
    }
  }

  // Hook for opening WinnerModal
  useEffect(() => {
    if (state.gameState === GameState.PlayerOneWin || state.gameState === GameState.PlayerTwoWin) {
      manageWinnerModal();
    }
  }, [state.gameState]);

  useEffect(() => {
    if (!isNewGame && gameState) {
      try {
        const parsedGameState = JSON.parse(gameState);
        const movesPlayed = parsedGameState.filter((piece: any) => piece !== Piece.None).length;
        const currentPlayerTurn = movesPlayed % 2 === 0 ? Piece.Yellow : Piece.Red;

        setState({
          ...state,
          board: parsedGameState,
          playerTurn: currentPlayerTurn,
        });
      } catch (error) {
        console.error("Error parsing gameState:", error);
      }
    }
  }, [isNewGame, gameState]);

  useEffect(() => {
    if (isMultiplayer) {
      saveState();
      connect4Events((boardState) => {
        const parsedBoardState = JSON.parse(boardState);
        /*const movesPlayed = parsedGameState.filter((piece: any) => piece !== Piece.None).length;
        const currentPlayerTurn = movesPlayed % 2 === 0 ? Piece.Yellow : Piece.Red;  */
        setState({
          board: parsedBoardState,
          playerTurn: nextColor(state.playerTurn),
          gameState: checkForWin(parsedBoardState),
          isModalOpen: false
        });
      });
    }
  }, [isMultiplayer, state]); // state mindenképpen kell, hogy frissüljön


  const saveState = async () => {
    try {
      const response = await axios.put(`/api/savedgames/savedgame/${savedGameId}`,
        JSON.stringify({
          SavedGameId: savedGameId,
          GameUrl: gameUrl,
          GameState: getBoardString(state.board)
        }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      )
    } catch (error: any) {
      console.error(error);
    }
  }


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

    setState({
      ...state,
      board: newBoard,
      playerTurn: nextColor(state.playerTurn),
      gameState: checkForWin(newBoard),
    });

    if (isMultiplayer) {
      const boardString = getBoardString(newBoard);
      if (gameUrl) {
        sendBoardState(auth.player.userName, enemy, boardString, gameUrl);
      }
      return;
    }
  };

  /* Managing winner modal */
  const manageWinnerModal = () => {
    setState(prevState => ({
      ...prevState,
      isModalOpen: !prevState.isModalOpen
    }));
  };

  const restartGame = () => {
    setState({
      board: createBoard(),
      playerTurn: Piece.Yellow,
      gameState: GameState.InProgress,
      isModalOpen: false,
    });

    if (isMultiplayer) {
      const boardString = JSON.stringify(createBoard());
      if (gameUrl) {
        sendBoardState(auth.player.userName, enemy, boardString, gameUrl);
      }
      return;
    }
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
    <Container maxW="container.lg" >
      <Grid templateColumns="repeat(12, 1fr)" gap={4}>
        <GridItem colSpan={3} className="side-menu mt-3">
          <Box boxShadow="base" p="4" rounded="md" mt="3">
            <Connect4Menu
              renderGameStatus={renderGameStatus()}
              currentPlayer={state.playerTurn === Piece.Yellow ? 'Yellow' : 'Red'}
            />
          </Box>
        </GridItem>
        <GridItem colSpan={9} className="board-container mt-3">
          <Box
            id="board"
            bg="var(--primary-color)"
            borderRadius="lg"
            width="700px"
            margin="auto"
            padding="16px"
            display="grid"
            gridTemplateColumns="repeat(7, 1fr)"
            gridGap="8px"
          >
            {renderCells()}
          </Box>
        </GridItem>
      </Grid>

      <WinnerModal
        isOpen={state.isModalOpen}
        onClose={manageWinnerModal}
        winnerName={state.gameState === GameState.PlayerOneWin ? 'Player One' : 'Player Two'}
        restart={restartGame}
      />
    </Container>
  );
};

export default Connect4Referee;