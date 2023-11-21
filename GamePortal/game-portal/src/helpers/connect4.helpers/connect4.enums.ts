/* Define enums for Connect4 game */
export enum Piece {
    None,
    Yellow,
    Red
}

export enum GameState {
    InProgress = -1,
    Draw = 0,
    PlayerOneWin = Piece.Yellow,
    PlayerTwoWin = Piece.Red
}