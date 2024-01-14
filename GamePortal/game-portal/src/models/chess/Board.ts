import { BLACK_PAWN_STARTING_ROW, DOWN, LEFT, RIGHT, UP, WHITE_PAWN_STARTING_ROW } from "../../helpers/chess.helpers/chess.constants";
import { PieceColor, PieceType } from "../../helpers/chess.helpers/chess.enums";
import { Pawn } from "./Pawn";
import { Piece } from "./Pieces";
import { Position } from "./Position";

/**
 * Source: https://www.youtube.com/playlist?list=PLBmRxydnERkysOgOS917Ojc_-uisgb8Aj
 * I was using this YouTube tutorial as a reference to create the logic of the chess game
 */

export class Board {
    pieces: Piece[];
    turns: number;
    winningColor?: PieceColor;


    private constructor(pieces: Piece[], turns: number, winningColor?: PieceColor) {
        this.pieces = pieces;
        this.turns = turns;
        this.winningColor = winningColor;
    }

    static fromFEN(fen: string): Board {
        const parts = fen.split(' ');

        const piecePlacement = parts[0];
        const castlingAvailability = parts[2];
        const turn = parseInt(parts[3]);
        const winner = parts[4];

        const pieces: Piece[] = [];
        const rows = piecePlacement.split('/');

        for (let rank = 7; rank >= 0; rank--) {
            const row = rows[7 - rank];
            let file = 0;

            for (const char of row) {
                if (/[1-8]/.test(char)) {
                    file += parseInt(char);
                } else {
                    const pieceColor = char === char.toUpperCase() ? PieceColor.WHITE : PieceColor.BLACK;
                    const pieceType = this.getPieceType(char);

                    let hasWhiteKingMoved = !castlingAvailability.includes("K") && !castlingAvailability.includes('Q');
                    let hasBlackKingMoved = !castlingAvailability.includes("k") && !castlingAvailability.includes('q');
                    let hasWhiteRookQueenSideMoved = !castlingAvailability.includes("Q")
                    let hasWhiteRookKingSideMoved = !castlingAvailability.includes("K")
                    let hasBlackRookQueenSideMoved = !castlingAvailability.includes("q")
                    let hasBlackRookKingSideMoved = !castlingAvailability.includes("k")

                    if (pieceType === PieceType.KING || pieceType === PieceType.ROOK) {
                        if (pieceType === PieceType.KING && PieceColor.WHITE && file === 4 && rank === 0) {
                            pieces.push(new Piece(new Position(file, rank), pieceType, pieceColor, hasWhiteKingMoved));
                        }
                        else if (pieceType === PieceType.KING && PieceColor.BLACK && file === 4 && rank === 7) {
                            pieces.push(new Piece(new Position(file, rank), pieceType, pieceColor, hasBlackKingMoved));
                        }
                        else if (pieceType === PieceType.ROOK && PieceColor.WHITE && file === 0 && rank === 0) {
                            pieces.push(new Piece(new Position(file, rank), pieceType, pieceColor, hasWhiteRookQueenSideMoved));
                        }
                        else if (pieceType === PieceType.ROOK && PieceColor.WHITE && file === 7 && rank === 0) {
                            pieces.push(new Piece(new Position(file, rank), pieceType, pieceColor, hasWhiteRookKingSideMoved));
                        }
                        else if (pieceType === PieceType.ROOK && PieceColor.BLACK && file === 0 && rank === 7) {
                            pieces.push(new Piece(new Position(file, rank), pieceType, pieceColor, hasBlackRookQueenSideMoved));
                        }
                        else if (pieceType === PieceType.ROOK && PieceColor.BLACK && file === 7 && rank === 7) {
                            pieces.push(new Piece(new Position(file, rank), pieceType, pieceColor, hasBlackRookKingSideMoved));
                        } else {
                            pieces.push(new Piece(new Position(file, rank), pieceType, pieceColor, true));
                        }
                    } else {
                        pieces.push(new Piece(new Position(file, rank), pieceType, pieceColor, false));
                    }
                    file++;
                }
            }
        }

        // Set the turns
        const turns = turn;
        let winningColor = undefined;
        if (winner !== "n") {
            winningColor = winner === "w" ? PieceColor.WHITE : PieceColor.BLACK;
        }

        return new Board(pieces, turns, winningColor);
    }

    private static getPieceType(char: string): PieceType {
        switch (char.toLowerCase()) {
            case 'p': return PieceType.PAWN;
            case 'n': return PieceType.KNIGHT;
            case 'b': return PieceType.BISHOP;
            case 'r': return PieceType.ROOK;
            case 'q': return PieceType.QUEEN;
            case 'k': return PieceType.KING;
            default: throw new Error(`Invalid piece type: ${char}`);
        }
    }

    generateFEN(): string {
        const piecePlacement = this.getPiecePlacement();
        const activeColor = this.getActiveColor();
        const castlingAvailability = this.getCastlingAvailability();

        return `${piecePlacement} ${activeColor} ${castlingAvailability} ${this.turns} ${this.getWinningColor()}`;
    }

    getWinningColor(): string {
        if (this.winningColor) {
            return this.winningColor === PieceColor.WHITE ? "w" : "b";
        }
        return "n";
    }

    getPiecePlacement(): string {
        let fenPlacement = '';
        for (let row = 7; row >= 0; row--) {
            let emptySquares = 0;
            for (let col = 0; col < 8; col++) {
                const piece = this.pieces.find(p => p.position.x === col && p.position.y === row);
                if (piece) {
                    if (emptySquares > 0) {
                        fenPlacement += emptySquares;
                        emptySquares = 0;
                    }
                    fenPlacement += this.getPieceChar(piece);
                } else {
                    emptySquares++;
                }
            }
            if (emptySquares > 0) {
                fenPlacement += emptySquares;
            }
            fenPlacement += '/';
        }
        fenPlacement = fenPlacement.slice(0, -1);
        return fenPlacement;
    }

    getPieceChar(piece: Piece): string {
        let result;

        switch (piece.type) {
            case 'pawn':
                result = 'p';
                break;
            case 'rook':
                result = 'r';
                break;
            case 'knight':
                result = 'n';
                break;
            case 'bishop':
                result = 'b';
                break;
            case 'queen':
                result = 'q';
                break;
            case 'king':
                result = 'k';
                break;
            default:
                result = piece.type.charAt(0);
        }
        return piece.color === PieceColor.WHITE ? result.toUpperCase() : result;
    }

    getActiveColor(): string {
        return this.getCurrentColor() === PieceColor.WHITE ? 'w' : 'b';
    }

    getCastlingAvailability(): string {
        const whiteKing = this.pieces.find(p => p.color === PieceColor.WHITE && p.isKing());
        const blackKing = this.pieces.find(p => p.color === PieceColor.BLACK && p.isKing());

        const whiteKingSideRook = this.pieces.find(p => p.color === PieceColor.WHITE && p.isRook() && p.position.x === 7 && p.position.y === 0);
        const whiteQueenSideRook = this.pieces.find(p => p.color === PieceColor.WHITE && p.isRook() && p.position.x === 0 && p.position.y === 0);

        const blackKingSideRook = this.pieces.find(p => p.color === PieceColor.BLACK && p.isRook() && p.position.x === 7 && p.position.y === 7);
        const blackQueenSideRook = this.pieces.find(p => p.color === PieceColor.BLACK && p.isRook() && p.position.x === 0 && p.position.y === 7);

        let castlingFen = '';

        if (whiteKing && !whiteKing.hasMoved) {
            if (whiteKingSideRook && !whiteKingSideRook.hasMoved) {
                castlingFen += 'K';
            }
            if (whiteQueenSideRook && !whiteQueenSideRook.hasMoved) {
                castlingFen += 'Q';
            }
        }

        if (blackKing && !blackKing.hasMoved) {
            if (blackKingSideRook && !blackKingSideRook.hasMoved) {
                castlingFen += 'k';
            }
            if (blackQueenSideRook && !blackQueenSideRook.hasMoved) {
                castlingFen += 'q';
            }
        }

        if (castlingFen === '') {
            castlingFen += '-';
        }

        return castlingFen;
    }


    getAllMoves() {
        for (const piece of this.pieces) {
            piece.availableMoves = this.getAvailableMoves(piece, this.pieces);
        }

        for (const king of this.pieces.filter((p) => p.isKing())) {
            if (!king.availableMoves) continue;

            king.availableMoves = [...king.availableMoves, ...this.getCastlingMoves(king, this.pieces)];
        }

        this.checkCurrentcolorMoves();

        for (const piece of this.pieces.filter((p) => p.color !== this.getCurrentColor())) {
            piece.availableMoves = [];
        }

        if (this.pieces.filter((p) => p.color === this.getCurrentColor()).some((p) => p.availableMoves && p.availableMoves.length > 0)) {
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
            if (!piece.availableMoves) continue;

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

    makeMove(letidMove: boolean, enPassantMove: boolean, desiredPos: Position, movedPiece: Piece): boolean {
        const pawnDirection = movedPiece.color === PieceColor.WHITE ? UP : DOWN;

        const desiredPosPiece = this.pieces.find((p) => p.samePosition(desiredPos));

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
        } else if (letidMove) {
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

            let letid = true;

            for (const opponent of enemyPieces) {
                if (!opponent.availableMoves) continue;

                for (const move of opponent.availableMoves) {
                    if (tilesBetween.some(t => t.samePosition(move))) {
                        letid = false;
                    }

                    if (!letid)
                        break;
                }

                if (!letid)
                    break;
            }

            if (!letid) continue;

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