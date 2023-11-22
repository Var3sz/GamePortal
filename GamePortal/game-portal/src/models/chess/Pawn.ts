import { PieceColor, PieceType } from "../../helpers/chess.helpers/chess.enums";
import { Piece } from "./Pieces";
import { Position } from "./Position";

export class Pawn extends Piece{
    enPassant?: boolean;
    
    constructor(position: Position, color: PieceColor, hasMoved: boolean, availableMoves: Position[] = [], enPassant?: boolean) {
        super(position, PieceType.PAWN, color, hasMoved);
        this.enPassant = enPassant;
        this.availableMoves = availableMoves;
        this.hasMoved = hasMoved;
    }

    clone(): Pawn {
        return new Pawn(this.position.clone(), this.color, this.hasMoved, this.availableMoves?.map((m) => m.clone()), this.enPassant);
    }
}