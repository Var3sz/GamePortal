import ChessBoard from './Chessboard';
import { Piece } from '../../models/chess/Pieces';
import { Position } from '../../models/chess/Position';
import { useEffect, useState } from 'react';
import { BLACK_PROMOTION_ROW, DOWN, UP, WHITE_PROMOTION_ROW, defaultBoard } from '../../helpers/chess.helpers/chess.constants';
import { PieceColor, PieceType } from '../../helpers/chess.helpers/chess.enums';
import { Container } from 'react-bootstrap';
import { Pawn } from '../../models/chess/Pawn';
import { Board } from '../../models/chess/Board';
import ChessConnector from '../../connection/chess.connector';
import PawnPromotionModal from './PawnPromotionModal';
import CheckmateModal from './CheckMateModal';

/**
 * Source: https://www.youtube.com/playlist?list=PLBmRxydnERkysOgOS917Ojc_-uisgb8Aj
 * I was using this YouTube tutorial as a reference to create a basic chess game
 */

interface RefereeProps {
    isMultiplayer: boolean
}

export const Referee: React.FC<RefereeProps> = ({ isMultiplayer }) => {
    const [board, setBoard] = useState<Board>(defaultBoard.clone());
    const [pawnToPromote, setPawnToPromote] = useState<Piece>();
    const [isPromotionModalOpen, setIsPromotionModalOpen] = useState(false);
    const [isCheckmateModalOpen, setIsCheckmateModalOpen] = useState(false);
    const { events, sendFEN } = ChessConnector();

    useEffect(() => {
        board.getAllMoves();
    }, [board]);

    useEffect(() => {
        board.getAllMoves();
        if (isMultiplayer) {
            events((fen) => setBoard(Board.fromFEN(fen)));
        }
    }, []);

    useEffect(() => {
        if (board.winningColor !== undefined) {
            setIsCheckmateModalOpen(true);
        } else {
            setIsCheckmateModalOpen(false);
        }
    }, [board.winningColor]);

    function makeMove(movedPiece: Piece, desiredPos: Position): boolean {
        // no available move
        if (movedPiece.availableMoves === undefined) {
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
                sendFEN(clone.generateFEN());
                console.log(clone.generateFEN());
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
        if (pawnToPromote === undefined) return;

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

            if (isMultiplayer) {
                sendFEN(clone.generateFEN());
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
            sendFEN(defaultBoard.clone().generateFEN());
            return defaultBoard.clone()
        });
    }

    return (
        <Container>
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
            <ChessBoard makeMove={makeMove} pieces={board.pieces} />
        </Container>
    )
};

export default Referee;