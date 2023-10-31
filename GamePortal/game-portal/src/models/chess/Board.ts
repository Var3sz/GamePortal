import { BLACK_PAWN_STARTING_ROW, DOWN, LEFT, RIGHT, UP, WHITE_PAWN_STARTING_ROW } from "../../constants/ChessConstants";
import { PieceColor, PieceType } from "../../enums/ChessEnums";
import { Pawn } from "./Pawn";
import { Piece } from "./Pieces";
import { Position } from "./Position";

export class Board {
    pieces: Piece[];
    turns: number;
    winningColor?: PieceColor;

    constructor(pieces: Piece[], turns: number) {
        this.pieces = pieces;
        this.turns = turns;
    }

    getAllMoves() {
        for (const piece of this.pieces) {
            piece.availableMoves = this.getAvailableMoves(piece, this.pieces);
        }

        for (const king of this.pieces.filter((p) => p.isKing())) {
            if (king.availableMoves === undefined) continue;

            king.availableMoves = [...king.availableMoves, ...this.getCastlingMoves(king, this.pieces)];
        }

        this.checkCurrentcolorMoves();

        for (const piece of this.pieces.filter((p) => p.color !== this.getCurrentColor())) {
            piece.availableMoves = [];
        }

        if (this.pieces.filter((p) => p.color === this.getCurrentColor()).some((p) => p.availableMoves !== undefined && p.availableMoves.length > 0)) {
            return;
        }

        this.winningColor = (this.getCurrentColor()) === PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE;

    }

    getCurrentColor() {
        if (this.turns % 2 === 1) {
            return PieceColor.WHITE;
        } else {
            return PieceColor.BLACK;
        }
    }

    checkCurrentcolorMoves() {
        for (const piece of this.pieces.filter((p) => p.color === this.getCurrentColor())) {
            if (piece.availableMoves === undefined) continue;

            for (const move of piece.availableMoves) {
                const simulatedBoard = this.clone();

                simulatedBoard.pieces = simulatedBoard.pieces.filter((p) => !p.samePosition(move));

                const clonedPiece = simulatedBoard.pieces.find((p) => p.samePiecePosition(piece))!;
                clonedPiece.position = move.clone();

                const clonedKing = simulatedBoard.pieces.find((p) => p.isKing() && p.color === simulatedBoard.getCurrentColor())!;

                for (const opponent of simulatedBoard.pieces.filter((p) => p.color !== simulatedBoard.getCurrentColor())) {
                    opponent.availableMoves = simulatedBoard.getAvailableMoves(opponent, simulatedBoard.pieces);

                    if (opponent.isPawn()) {
                        if (opponent.availableMoves.some((m) => m.x !== opponent.position.x
                            && m.samePosition(clonedKing.position))) {
                            piece.availableMoves = piece.availableMoves?.filter((m) => !m.samePosition(move));
                        }
                    } else {
                        if (opponent.availableMoves.some((m) => m.samePosition(clonedKing.position))) {
                            piece.availableMoves = piece.availableMoves?.filter((m) => !m.samePosition(move));
                        }
                    }
                }
            }
        }
    }

    makeMove(validMove: boolean, enPassantMove: boolean, desiredPos: Position, movedPiece: Piece): boolean {
        const pawnDirection = movedPiece.color === PieceColor.WHITE ? UP : DOWN;

        const desiredPosPiece = this.pieces.find((p) => p.samePosition(desiredPos));

        // If the move is a castling move do this

        if (movedPiece.isKing() && desiredPosPiece?.isRook && desiredPosPiece.color === movedPiece.color) {
            const direction = (desiredPosPiece.position.x - movedPiece.position.x > 0) ? RIGHT : LEFT;
            const newKingPosition = movedPiece.position.x + direction * 2;
            this.pieces = this.pieces.map((p) => {
                if (p.samePiecePosition(movedPiece)) {
                    p.position.x = newKingPosition;
                } else if (p.samePiecePosition(desiredPosPiece)) {
                    p.position.x = newKingPosition - direction;
                }

                return p;
            });

            this.getAllMoves();
            return true;
        }

        if (enPassantMove) {
            this.pieces = this.pieces.reduce((results, piece) => {
                if (piece.samePiecePosition(movedPiece)) {
                    if (piece.isPawn()) {
                        (piece as Pawn).enPassant = false;
                    }

                    piece.position.x = desiredPos.x;
                    piece.position.y = desiredPos.y;
                    piece.hasMoved = true;

                    results.push(piece);
                } else if (!piece.samePosition(new Position(desiredPos.x, desiredPos.y - pawnDirection))) {
                    if (piece.isPawn()) {
                        (piece as Pawn).enPassant = false;
                    }
                    results.push(piece);
                }

                return results;
            }, [] as Piece[]);
            this.getAllMoves();
        } else if (validMove) {
            this.pieces = this.pieces.reduce((results, piece) => {
                if (piece.samePiecePosition(movedPiece)) {
                    if (piece.isPawn()) {
                        (piece as Pawn).enPassant = Math.abs(movedPiece.position.y - desiredPos.y) === 2 && piece.type === PieceType.PAWN;
                    }
                    piece.position.x = desiredPos.x;
                    piece.position.y = desiredPos.y;
                    piece.hasMoved = true;

                    results.push(piece);
                } else if (!piece.samePosition(desiredPos)) {
                    if (piece.isPawn()) {
                        (piece as Pawn).enPassant = false;
                    }
                    results.push(piece);
                }

                return results;
            }, [] as Piece[]);

            this.getAllMoves();
        } else {
            return false;
        }
        return true;
    }


    getAvailableMoves(piece: Piece, boardState: Piece[]): Position[] {
        switch (piece.type) {
            case PieceType.PAWN:
                return this.getAvailablePawnMoves(piece, boardState);
            case PieceType.KNIGHT:
                return this.getAvailableKnightMoves(piece, boardState);
            case PieceType.BISHOP:
                return this.getAvailableBishopMoves(piece, boardState);
            case PieceType.ROOK:
                return this.getAvailableRookMoves(piece, boardState);
            case PieceType.QUEEN:
                return this.getAvailableQueenMoves(piece, boardState);
            case PieceType.KING:
                return this.getAvailableKingMoves(piece, boardState);
            default:
                return [];
        }
    }


    getCastlingMoves(king: Piece, boardstate: Piece[]): Position[] {
        const availableMoves: Position[] = [];

        if (king.hasMoved) return availableMoves;

        const rooks = boardstate.filter((p) => p.isRook()
            && p.color === king.color && !p.hasMoved);

        for (const rook of rooks) {
            const direction = (rook.position.x - king.position.x > 0) ? RIGHT : LEFT;

            const desiredCastlingPos = king.position.clone();
            desiredCastlingPos.x += direction;

            if (!rook.availableMoves?.some((m) => m.samePosition(desiredCastlingPos))) continue;

            const tilesBetween = rook.availableMoves.filter((m) => m.y === king.position.y);

            const enemyPieces = boardstate.filter((p) => p.color !== king.color);

            let valid = true;

            for (const opponent of enemyPieces) {
                if (opponent.availableMoves === undefined) continue;

                for (const move of opponent.availableMoves) {
                    if (tilesBetween.some(t => t.samePosition(move))) {
                        valid = false;
                    }

                    if (!valid)
                        break;
                }

                if (!valid)
                    break;
            }

            if (!valid) continue;

            availableMoves.push(rook.position.clone());
        }

        return availableMoves;
    }

    getAvailableKingMoves(piece: Piece, boardState: Piece[]): Position[] {
        const availableMoves = [];

        // upper right
        for (let i = 1; i < 2; i++) {
            const desiredPos = new Position(piece.position.x + i, piece.position.y + i);

            if (desiredPos.x < 0 || desiredPos.x > 7 || desiredPos.y < 0 || desiredPos.y > 7) {
                break;
            }

            if (this.tileIsEmpty(desiredPos, boardState)) {
                availableMoves.push(desiredPos);
            } else if (this.tileIsOccupiedByopponent(desiredPos, boardState, piece.color)) {
                availableMoves.push(desiredPos);
                break;
            } else {
                break;
            }
        }

        // bottom right
        for (let i = 1; i < 2; i++) {
            const desiredPos = new Position(piece.position.x + i, piece.position.y - i);

            if (desiredPos.x < 0 || desiredPos.x > 7 || desiredPos.y < 0 || desiredPos.y > 7) {
                break;
            }

            if (this.tileIsEmpty(desiredPos, boardState)) {
                availableMoves.push(desiredPos);
            } else if (this.tileIsOccupiedByopponent(desiredPos, boardState, piece.color)) {
                availableMoves.push(desiredPos);
                break;
            } else {
                break;
            }
        }

        // bottom left
        for (let i = 1; i < 2; i++) {
            const desiredPos = new Position(piece.position.x - i, piece.position.y - i);

            if (desiredPos.x < 0 || desiredPos.x > 7 || desiredPos.y < 0 || desiredPos.y > 7) {
                break;
            }

            if (this.tileIsEmpty(desiredPos, boardState)) {
                availableMoves.push(desiredPos);
            } else if (this.tileIsOccupiedByopponent(desiredPos, boardState, piece.color)) {
                availableMoves.push(desiredPos);
                break;
            } else {
                break;
            }
        }

        // top left
        for (let i = 1; i < 2; i++) {
            const desiredPos = new Position(piece.position.x - i, piece.position.y + i);

            if (desiredPos.x < 0 || desiredPos.x > 7 || desiredPos.y < 0 || desiredPos.y > 7) {
                break;
            }

            if (this.tileIsEmpty(desiredPos, boardState)) {
                availableMoves.push(desiredPos);
            } else if (this.tileIsOccupiedByopponent(desiredPos, boardState, piece.color)) {
                availableMoves.push(desiredPos);
                break;
            } else {
                break;
            }
        }

        // Bottom movement
        for (let i = 1; i < 2; i++) {
            const desiredPos = new Position(piece.position.x, piece.position.y - i);

            if (desiredPos.x < 0 || desiredPos.x > 7 || desiredPos.y < 0 || desiredPos.y > 7) {
                break;
            }

            if (this.tileIsEmpty(desiredPos, boardState)) {
                availableMoves.push(desiredPos);
            } else if (this.tileIsOccupiedByopponent(desiredPos, boardState, piece.color)) {
                availableMoves.push(desiredPos);
                break;
            } else {
                break;
            }
        }

        //top movement
        for (let i = 1; i < 2; i++) {
            const desiredPos = new Position(piece.position.x, piece.position.y + i);

            if (desiredPos.x < 0 || desiredPos.x > 7 || desiredPos.y < 0 || desiredPos.y > 7) {
                break;
            }

            if (this.tileIsEmpty(desiredPos, boardState)) {
                availableMoves.push(desiredPos);
            } else if (this.tileIsOccupiedByopponent(desiredPos, boardState, piece.color)) {
                availableMoves.push(desiredPos);
                break;
            } else {
                break;
            }
        }

        // left
        for (let i = 1; i < 2; i++) {
            const desiredPos = new Position(piece.position.x - i, piece.position.y);

            if (desiredPos.x < 0 || desiredPos.x > 7 || desiredPos.y < 0 || desiredPos.y > 7) {
                break;
            }

            if (this.tileIsEmpty(desiredPos, boardState)) {
                availableMoves.push(desiredPos);
            } else if (this.tileIsOccupiedByopponent(desiredPos, boardState, piece.color)) {
                availableMoves.push(desiredPos);
                break;
            } else {
                break;
            }
        }

        //right 
        for (let i = 1; i < 2; i++) {
            const desiredPos = new Position(piece.position.x + i, piece.position.y);

            if (desiredPos.x < 0 || desiredPos.x > 7 || desiredPos.y < 0 || desiredPos.y > 7) {
                break;
            }

            if (this.tileIsEmpty(desiredPos, boardState)) {
                availableMoves.push(desiredPos);
            } else if (this.tileIsOccupiedByopponent(desiredPos, boardState, piece.color)) {
                availableMoves.push(desiredPos);
                break;
            } else {
                break;
            }
        }

        return availableMoves;
    }

    getAvailableQueenMoves(piece: Piece, boardState: Piece[]): Position[] {
        const availableMoves = [];

        // upper right
        for (let i = 1; i < 8; i++) {
            const desiredPos = new Position(piece.position.x + i, piece.position.y + i);

            if (this.tileIsEmpty(desiredPos, boardState)) {
                availableMoves.push(desiredPos);
            } else if (this.tileIsOccupiedByopponent(desiredPos, boardState, piece.color)) {
                availableMoves.push(desiredPos);
                break;
            } else {
                break;
            }
        }

        // bottom right
        for (let i = 1; i < 8; i++) {
            const desiredPos = new Position(piece.position.x + i, piece.position.y - i);

            if (this.tileIsEmpty(desiredPos, boardState)) {
                availableMoves.push(desiredPos);
            } else if (this.tileIsOccupiedByopponent(desiredPos, boardState, piece.color)) {
                availableMoves.push(desiredPos);
                break;
            } else {
                break;
            }
        }

        // bottom left
        for (let i = 1; i < 8; i++) {
            const desiredPos = new Position(piece.position.x - i, piece.position.y - i);

            if (this.tileIsEmpty(desiredPos, boardState)) {
                availableMoves.push(desiredPos);
            } else if (this.tileIsOccupiedByopponent(desiredPos, boardState, piece.color)) {
                availableMoves.push(desiredPos);
                break;
            } else {
                break;
            }
        }

        // top left
        for (let i = 1; i < 8; i++) {
            const desiredPos = new Position(piece.position.x - i, piece.position.y + i);

            if (this.tileIsEmpty(desiredPos, boardState)) {
                availableMoves.push(desiredPos);
            } else if (this.tileIsOccupiedByopponent(desiredPos, boardState, piece.color)) {
                availableMoves.push(desiredPos);
                break;
            } else {
                break;
            }
        }

        // Bottom movement
        for (let i = 1; i < 8; i++) {
            const desiredPos = new Position(piece.position.x, piece.position.y - i);
            if (this.tileIsEmpty(desiredPos, boardState)) {
                availableMoves.push(desiredPos);
            } else if (this.tileIsOccupiedByopponent(desiredPos, boardState, piece.color)) {
                availableMoves.push(desiredPos);
                break;
            } else {
                break;
            }
        }

        //top movement
        for (let i = 1; i < 8; i++) {
            const desiredPos = new Position(piece.position.x, piece.position.y + i);
            if (this.tileIsEmpty(desiredPos, boardState)) {
                availableMoves.push(desiredPos);
            } else if (this.tileIsOccupiedByopponent(desiredPos, boardState, piece.color)) {
                availableMoves.push(desiredPos);
                break;
            } else {
                break;
            }
        }

        // left
        for (let i = 1; i < 8; i++) {
            const desiredPos = new Position(piece.position.x - i, piece.position.y);
            if (this.tileIsEmpty(desiredPos, boardState)) {
                availableMoves.push(desiredPos);
            } else if (this.tileIsOccupiedByopponent(desiredPos, boardState, piece.color)) {
                availableMoves.push(desiredPos);
                break;
            } else {
                break;
            }
        }

        //right 
        for (let i = 1; i < 8; i++) {
            const desiredPos = new Position(piece.position.x + i, piece.position.y);
            if (this.tileIsEmpty(desiredPos, boardState)) {
                availableMoves.push(desiredPos);
            } else if (this.tileIsOccupiedByopponent(desiredPos, boardState, piece.color)) {
                availableMoves.push(desiredPos);
                break;
            } else {
                break;
            }
        }

        return availableMoves;
    }

    getAvailableRookMoves(piece: Piece, boardState: Piece[]): Position[] {
        const availableMoves = [];

        // Bottom movement
        for (let i = 1; i < 8; i++) {
            if (piece.position.y - i < 0) {
                break;
            }

            const desiredPos = new Position(piece.position.x, piece.position.y - i);
            if (this.tileIsEmpty(desiredPos, boardState)) {
                availableMoves.push(desiredPos);
            } else if (this.tileIsOccupiedByopponent(desiredPos, boardState, piece.color)) {
                availableMoves.push(desiredPos);
                break;
            } else {
                break;
            }
        }

        //top movement
        for (let i = 1; i < 8; i++) {
            if (piece.position.y + i > 7) {
                break;
            }

            const desiredPos = new Position(piece.position.x, piece.position.y + i);
            if (this.tileIsEmpty(desiredPos, boardState)) {
                availableMoves.push(desiredPos);
            } else if (this.tileIsOccupiedByopponent(desiredPos, boardState, piece.color)) {
                availableMoves.push(desiredPos);
                break;
            } else {
                break;
            }
        }

        // left
        for (let i = 1; i < 8; i++) {
            if (piece.position.x - i < 0) {
                break;
            }

            const desiredPos = new Position(piece.position.x - i, piece.position.y);
            if (this.tileIsEmpty(desiredPos, boardState)) {
                availableMoves.push(desiredPos);
            } else if (this.tileIsOccupiedByopponent(desiredPos, boardState, piece.color)) {
                availableMoves.push(desiredPos);
                break;
            } else {
                break;
            }
        }

        //right 
        for (let i = 1; i < 8; i++) {
            if (piece.position.x + i > 7) {
                break;
            }

            const desiredPos = new Position(piece.position.x + i, piece.position.y);
            if (this.tileIsEmpty(desiredPos, boardState)) {
                availableMoves.push(desiredPos);
            } else if (this.tileIsOccupiedByopponent(desiredPos, boardState, piece.color)) {
                availableMoves.push(desiredPos);
                break;
            } else {
                break;
            }
        }

        return availableMoves;
    }

    getAvailableBishopMoves(piece: Piece, boardState: Piece[]): Position[] {
        const availableMoves = [];

        // upper right
        for (let i = 1; i < 8; i++) {
            const desiredPos = new Position(piece.position.x + i, piece.position.y + i);

            if (this.tileIsEmpty(desiredPos, boardState)) {
                availableMoves.push(desiredPos);
            } else if (this.tileIsOccupiedByopponent(desiredPos, boardState, piece.color)) {
                availableMoves.push(desiredPos);
                break;
            } else {
                break;
            }
        }

        // bottom right
        for (let i = 1; i < 8; i++) {
            const desiredPos = new Position(piece.position.x + i, piece.position.y - i);

            if (this.tileIsEmpty(desiredPos, boardState)) {
                availableMoves.push(desiredPos);
            } else if (this.tileIsOccupiedByopponent(desiredPos, boardState, piece.color)) {
                availableMoves.push(desiredPos);
                break;
            } else {
                break;
            }
        }

        // bottom left
        for (let i = 1; i < 8; i++) {
            const desiredPos = new Position(piece.position.x - i, piece.position.y - i);

            if (this.tileIsEmpty(desiredPos, boardState)) {
                availableMoves.push(desiredPos);
            } else if (this.tileIsOccupiedByopponent(desiredPos, boardState, piece.color)) {
                availableMoves.push(desiredPos);
                break;
            } else {
                break;
            }
        }

        // top left
        for (let i = 1; i < 8; i++) {
            const desiredPos = new Position(piece.position.x - i, piece.position.y + i);

            if (this.tileIsEmpty(desiredPos, boardState)) {
                availableMoves.push(desiredPos);
            } else if (this.tileIsOccupiedByopponent(desiredPos, boardState, piece.color)) {
                availableMoves.push(desiredPos);
                break;
            } else {
                break;
            }
        }

        return availableMoves;
    }

    getAvailableKnightMoves(piece: Piece, boardState: Piece[]): Position[] {
        const availableMoves = [];

        for (let i = -1; i < 2; i += 2) {
            for (let j = -1; j < 2; j += 2) {
                const verticalMove = new Position(piece.position.x + j, piece.position.y + i * 2);
                const horizontalMove = new Position(piece.position.x + i * 2, piece.position.y + j);
                if (this.tileIsEmpty(verticalMove, boardState) || this.tileIsOccupiedByopponent(verticalMove, boardState, piece.color)) {
                    availableMoves.push(verticalMove);
                }
                if (this.tileIsEmpty(horizontalMove, boardState) || this.tileIsOccupiedByopponent(horizontalMove, boardState, piece.color)) {
                    availableMoves.push(horizontalMove);
                }
            }
        }


        return availableMoves;
    }

    getAvailablePawnMoves(piece: Piece, boardState: Piece[]): Position[] {
        const availableMoves = [];
        const startingRow = piece.color === PieceColor.WHITE ? WHITE_PAWN_STARTING_ROW : BLACK_PAWN_STARTING_ROW;
        const pawnDirection = piece.color === PieceColor.WHITE ? UP : DOWN;

        const normalMove = new Position(piece.position.x, piece.position.y + pawnDirection);
        const specialMove = new Position(piece.position.x, piece.position.y + pawnDirection * 2);
        const leftAttack = new Position(piece.position.x - 1, piece.position.y + pawnDirection);
        const rightAttack = new Position(piece.position.x + 1, piece.position.y + pawnDirection);
        const leftPos = new Position(piece.position.x - 1, piece.position.y);
        const rightPos = new Position(piece.position.x + 1, piece.position.y);

        if (this.tileIsEmpty(normalMove, boardState)) {
            availableMoves.push(normalMove);
            if (piece.position.y === startingRow && this.tileIsEmpty(specialMove, boardState)) {
                availableMoves.push(specialMove);
            }
        }

        if (this.tileIsOccupiedByopponent(leftAttack, boardState, piece.color)) {
            availableMoves.push(leftAttack);
        } else if (this.tileIsEmpty(leftAttack, boardState)) {
            const leftPiece = boardState.find((p) => p.samePosition(leftPos));
            if (leftPiece && leftPiece.isPawn() && (leftPiece as Pawn).enPassant) {
                availableMoves.push(leftAttack);
            }
        }

        if (this.tileIsOccupiedByopponent(rightAttack, boardState, piece.color)) {
            availableMoves.push(rightAttack);
        } else if (this.tileIsEmpty(rightAttack, boardState)) {
            const rightPiece = boardState.find((p) => p.samePosition(rightPos));
            if (rightPiece && rightPiece.isPawn() && (rightPiece as Pawn).enPassant) {
                availableMoves.push(rightAttack);
            }
        }

        return availableMoves;
    }

    tileIsEmpty(position: Position, boardState: Piece[]) {
        return !boardState.some((p) => p.samePosition(position));
    }

    tileIsOccupiedByopponent(position: Position, boardState: Piece[], color: PieceColor) {
        const piece = boardState.find((p) => p.samePosition(position) && p.color !== color);
        return !!piece;
    }

    clone(): Board {
        return new Board(this.pieces.map((p) => p.clone()), this.turns);
    }

}