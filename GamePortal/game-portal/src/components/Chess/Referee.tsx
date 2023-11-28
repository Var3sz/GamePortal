import ChessBoard from './Chessboard';
import { Piece } from '../../models/chess/Pieces';
import { Position } from '../../models/chess/Position';
import { useEffect, useMemo, useState } from 'react';
import { BLACK_PROMOTION_ROW, DOWN, UP, WHITE_PROMOTION_ROW, defaultBoard } from '../../helpers/chess.helpers/chess.constants';
import { PieceColor, PieceType } from '../../helpers/chess.helpers/chess.enums';
import { Container } from 'react-bootstrap';
import { Pawn } from '../../models/chess/Pawn';
import { Board } from '../../models/chess/Board';
import ChessConnector from '../../connection/chess.connector';
import PawnPromotionModal from './PawnPromotionModal';
import CheckmateModal from './CheckMateModal';
import { Card, Flex, Heading, Text } from '@chakra-ui/react';
import { SavedGame } from '../../models/savedGame.model';
import axios from '../../api/axios';
import useAuth from '../../auth/useAuth';

/**
 * Source: https://www.youtube.com/playlist?list=PLBmRxydnERkysOgOS917Ojc_-uisgb8Aj
 * I was using this YouTube tutorial as a reference to create the logic of the chess game
 */

interface RefereeProps {
    isMultiplayer: boolean;
    isNewGame?: boolean;
    savedGame?: SavedGame;
}

export const Referee: React.FC<RefereeProps> = ({ isMultiplayer, isNewGame, savedGame }) => {
    const [board, setBoard] = useState<Board>(defaultBoard.clone());
    const [pawnToPromote, setPawnToPromote] = useState<Piece>();
    const [isPromotionModalOpen, setIsPromotionModalOpen] = useState(false);
    const [isCheckmateModalOpen, setIsCheckmateModalOpen] = useState(false);
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
            }
        }
    }, [auth.player.userName, gameUrl]);

    const { chessEvents, sendFEN } = chessConnector;


    let enemy: string;

    if (playerOne && playerTwo) {
        if (auth.player.userName === playerOne.userName) {
            enemy = playerTwo.userName;
        } else {
            enemy = playerOne.userName;
        }
    }

    useEffect(() => {
        if (!isNewGame && gameState) {
            setBoard(Board.fromFEN(gameState));
        }
    }, [isNewGame, gameState]);

    useEffect(() => {
        board.getAllMoves();

        if (isMultiplayer) {
            saveState();
            chessEvents((fen: string) => setBoard(prevBoard => {
                const newBoard = Board.fromFEN(fen);
                return newBoard;
            }));
        }
    }, [board, isMultiplayer]);

    useEffect(() => {
        if (board.winningColor) {
            setIsCheckmateModalOpen(true);
        } else {
            setIsCheckmateModalOpen(false);
        }
    }, [board.winningColor]);

    const saveState = async () => {
        try {
            const response = await axios.put(`/api/savedgames/savedgame/${savedGameId}`,
                JSON.stringify({
                    SavedGameId: savedGameId,
                    GameUrl: gameUrl,
                    GameState: board.generateFEN()
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

    function makeMove(movedPiece: Piece, desiredPos: Position): boolean {
        if (isMultiplayer) {
            const authenticatedUserIsPlayerOne = auth.player.userName === playerOne?.userName;
            const authenticatedUserIsPlayerTwo = auth.player.userName === playerTwo?.userName;

            // Check if the authenticated user is the correct player based on the color of the moved piece
            if ((movedPiece.color === PieceColor.WHITE && !authenticatedUserIsPlayerOne) ||
                (movedPiece.color === PieceColor.BLACK && !authenticatedUserIsPlayerTwo)) {
                return false; // Authenticated user is not the correct player for this move
            }
        }

        // no available move
        if (!movedPiece.availableMoves) {
            return false;
        }

        if (movedPiece.color === PieceColor.WHITE && board.turns % 2 !== 1) {
            return false;
        }

        if (movedPiece.color === PieceColor.BLACK && board.turns % 2 !== 0) {
            return false;
        }

        let moveIsValid = false;


        const validMove = movedPiece.availableMoves?.some((m) => m.samePosition(desiredPos));
        if (!validMove) {
            return false;
        }

        const enPassantMove = isEnPassantMove(movedPiece.position, desiredPos, movedPiece.type, movedPiece.color);

        setBoard((prevBoard) => {
            const clone = prevBoard.clone();
            clone.turns++;
            moveIsValid = clone.makeMove(validMove, enPassantMove, desiredPos, movedPiece);

            if (isMultiplayer) {
                if (gameUrl) {
                    sendFEN(auth.player.userName, enemy, clone.generateFEN(), gameUrl!);
                }
            }

            return clone;
        });


        let promotionRow = (movedPiece.color === PieceColor.WHITE) ? WHITE_PROMOTION_ROW : BLACK_PROMOTION_ROW;
        if (desiredPos.y === promotionRow && movedPiece.isPawn()) {
            setIsPromotionModalOpen(true);
            setPawnToPromote((prevPromotionPawn) => {
                const clone = movedPiece.clone();
                clone.position = desiredPos.clone();
                return clone;
            });
        }

        return validMove;
    }

    function isEnPassantMove(prevPos: Position, currPos: Position, type: PieceType, color: PieceColor) {
        const pawnDirection = color === PieceColor.WHITE ? UP : DOWN;
        if (
            type === PieceType.PAWN &&
            ((currPos.x - prevPos.x) === UP || (currPos.x - prevPos.x) === DOWN) &&
            currPos.y - prevPos.y === pawnDirection
        ) {
            const piece = board.pieces.find(p => p.position.x === currPos.x && p.position.y === currPos.y - pawnDirection && p.isPawn() && (p as Pawn).enPassant);
            return !!piece;
        }
        return false;
    }

    function promotePawn(type: PieceType) {
        if (!pawnToPromote) return;

        setBoard((prevBoard) => {
            const clone = board.clone();
            clone.pieces = clone.pieces.reduce((results, piece) => {
                if (piece.samePiecePosition(pawnToPromote)) {
                    results.push(new Piece(piece.position.clone(), type, piece.color, true));
                } else {
                    results.push(piece);
                }
                return results;
            }, [] as Piece[]);
            clone.getAllMoves();

            if (gameUrl) {
                sendFEN(auth.player.userName, enemy, clone.generateFEN(), gameUrl!);
            }

            return clone;
        });
        setIsPromotionModalOpen(false);
    }

    function pawnPromotionColor() {
        return (pawnToPromote?.color === PieceColor.WHITE) ? "white" : "black";
    }

    function restartGame() {
        setBoard(() => {
            if (gameUrl) {
                sendFEN(auth.player.userName, enemy, defaultBoard.clone().generateFEN(), gameUrl!);
            }
            return defaultBoard.clone()
        });
    }

    return (
        <Container className='d-flex'>
            <PawnPromotionModal
                isOpen={isPromotionModalOpen}
                promotePawn={promotePawn}
                pawnPromotionColor={pawnPromotionColor}
            />
            <CheckmateModal
                isOpen={isCheckmateModalOpen}
                winningColor={board.winningColor}
                restartGame={restartGame}
            />
            <Flex
                direction="row"
                align="center"
                justify="center"
            >
                <Card p={8} mr={15}>
                    <Heading fontSize="xl">PlayerOne: {playerOne?.userName}</Heading>
                    <Text>Color: white</Text>
                    {board.getCurrentColor() === PieceColor.WHITE ? (
                        <Text>It is your turn</Text>
                    ) : (
                        <></>
                    )}
                </Card>

                <ChessBoard makeMove={makeMove} pieces={board.pieces} />

                <Card p={8} ml={15}>
                    <Heading fontSize="xl">PlayerTwo: {playerTwo?.userName}</Heading>
                    <Text>Color: black</Text>
                    {board.getCurrentColor() === PieceColor.BLACK ? (
                        <Text>It is your turn</Text>
                    ) : (
                        <></>
                    )}
                </Card>
            </Flex>

        </Container>
    )
};

export default Referee;