import { PieceColor, PieceType } from "../../enums/ChessEnums"
import { Position } from "./Position";

export class Piece {
    image: string;
    position: Position;
    type: PieceType;
    color: PieceColor;
    availableMoves?: Position[];
    hasMoved: boolean;

    constructor(position: Position, type: PieceType, color: PieceColor, hasMoved: boolean, availableMoves: Position[] = []) {
        this.image = `chess-pieces/${color}_${type}.png`;
        this.position = position;
        this.type = type;
        this.color = color;
        this.availableMoves = availableMoves;
        this.hasMoved = hasMoved;
    }

    isPawn(): boolean {
        return this.type === PieceType.PAWN;
    }

    isKnight(): boolean {
        return this.type === PieceType.KNIGHT;
    }

    isBishop(): boolean {
        return this.type === PieceType.BISHOP;
    }

    isRook(): boolean {
        return this.type === PieceType.ROOK;
    }

    isQueen(): boolean {
        return this.type === PieceType.QUEEN;
    }

    isKing(): boolean {
        return this.type === PieceType.KING;
    }

    samePiecePosition(other: Piece): boolean {
        return this.position.samePosition(other.position);
    }

    samePosition(other: Position): boolean {
        return this.position.samePosition(other);
    }

    clone(): Piece {
        //if (this.availableMoves){
            return new Piece(this.position.clone(), this.type, this.color, this.hasMoved, this.availableMoves?.map((m) => m.clone()));
        //}
    }
}