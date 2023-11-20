import ChessBoard from './Chessboard';
import { Piece } from '../../models/chess/Pieces';
import { Position } from '../../models/chess/Position';
import { useEffect, useRef, useState } from 'react';
import { BLACK_PROMOTION_ROW, DOWN, UP, WHITE_PROMOTION_ROW, defaultBoard } from '../../constants/ChessConstants';
import { PieceColor, PieceType } from '../../enums/ChessEnums';
import { Button, Container } from 'react-bootstrap';
import { Pawn } from '../../models/chess/Pawn';
import { Board } from '../../models/chess/Board';
import Connector from '../../connection/ChessConnector';


interface RefereeProps {
    isMultiplayer: boolean
}

export const Referee: React.FC<RefereeProps> = ({ isMultiplayer }) => {
    const [board, setBoard] = useState<Board>(defaultBoard.clone());
    const [pawnToPromote, setPawnToPromote] = useState<Piece>();
    const modalRef = useRef<HTMLDivElement>(null);
    const checkMateModalRef = useRef<HTMLDivElement>(null);

    const { newMessage, events, sendFEN, receiveFEN } = Connector();
    const [currentFEN, setCurrentFEN] = useState<string>(board.generateFEN());

    const [message, setMessage] = useState("initial value");
    useEffect(() => {
        events((_, message) => setMessage(message));
    });

    useEffect(() => {
        board.getAllMoves();
    }, []);

    useEffect(() => {
        // Send the FEN when the board changes
        sendFEN(board.generateFEN());

        // Receive and update the board when FEN is received
        receiveFEN((fen) => {
            setBoard(Board.fromFEN(fen)); // Assuming you have a method to load the board from FEN
        });
    }, [board]); // Add board as a dependency to the useEffect


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

        setBoard(() => {
            const clone = board.clone();
            clone.turns++;
            moveIsValid = clone.makeMove(validMove, enPassantMove, desiredPos, movedPiece);

            if (clone.winningColor !== undefined) {
                checkMateModalRef.current?.classList.remove("hidden");
            }

            return clone;
        });


        let promotionRow = (movedPiece.color === PieceColor.WHITE) ? WHITE_PROMOTION_ROW : BLACK_PROMOTION_ROW;
        if (desiredPos.y === promotionRow && movedPiece.isPawn()) {
            modalRef.current?.classList.remove("hidden");
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
            return clone;
        });
        modalRef.current?.classList.add("hidden");
    }

    function pawnPromotionColor() {
        return (pawnToPromote?.color === PieceColor.WHITE) ? "white" : "black";
    }

    function restartGame() {
        checkMateModalRef.current?.classList.add("hidden");
        setBoard(defaultBoard.clone());
    }

    return (
        <>
            <Container className='chess-modal hidden' ref={modalRef}>
                <Container className="modal-body">
                    <img onClick={() => promotePawn(PieceType.ROOK)} src={`chess-pieces/${pawnPromotionColor()}_rook.png`} />
                    <img onClick={() => promotePawn(PieceType.BISHOP)} src={`chess-pieces/${pawnPromotionColor()}_bishop.png`} />
                    <img onClick={() => promotePawn(PieceType.KNIGHT)} src={`chess-pieces/${pawnPromotionColor()}_knight.png`} />
                    <img onClick={() => promotePawn(PieceType.QUEEN)} src={`chess-pieces/${pawnPromotionColor()}_queen.png`} />
                </Container>
            </Container>
            <Container className="chess-modal hidden" ref={checkMateModalRef}>
                <Container className="modal-body">
                    <Container className="checkmate-body">
                        <span>The winner is {board.winningColor === PieceColor.WHITE ? "White" : "Black"}!</span>
                        <Button onClick={restartGame}>Rematch</Button>
                    </Container>
                </Container>
            </Container>
            <ChessBoard makeMove={makeMove} pieces={board.pieces} />
            <div>
                <span>message from signalR: <span style={{ color: "green" }}>{message}</span> </span>
                <br />
                <button onClick={() => newMessage((new Date()).toISOString())}>send date </button>
            </div>
        </>
    )
};


export default Referee;