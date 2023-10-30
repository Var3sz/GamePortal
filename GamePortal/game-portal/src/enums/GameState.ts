import Player from "../enums/Player";

// GameState enum
enum GameState {
    InProgress = -1,
    Draw = 0,
    PlayerOneWin = Player.One,
    PlayerTwoWin = Player.Two
}

export default GameState;
