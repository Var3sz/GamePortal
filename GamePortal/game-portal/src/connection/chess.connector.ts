import * as signalR from "@microsoft/signalr";

const ChessHubURL = "http://localhost:5086/chesshub";

class ChessConnector {
    private connection: signalR.HubConnection;
    public chessEvents: (onFENReceived: (fen: string) => void) => void;
    public connect4Events: (onBoardStateReceived: (boardState: string) => void) => void;
    static instance: ChessConnector;
    constructor(username: string, gameUrl: string) {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(ChessHubURL)
            .withAutomaticReconnect()
            .build();
        this.connection.start().catch(err => document.write(err)).then(() => {
            this.registerUser(username, "cső", gameUrl);
        });
        this.chessEvents = (onFENReceived) => {
            this.connection.on("receiveFEN", (fen) => {
                onFENReceived(fen);
            });
        };
        this.connect4Events = (onBoardStateReceived) => {
            this.connection.on("receiveBoardState", (boardState) => {
                onBoardStateReceived(boardState);
                console.log(`ReceivedBoardState: ${boardState}`)
            });
        }
    }

    public registerUser = (name: string, message: string, gameUrl: string) => {
        this.connection.send("registerUsers", name, message, gameUrl).then(() => { });
    }

    public sendFEN = (fromUsername: string, toUsername: string, fen: string, gameUrl: string) => {
        this.connection.send("sendFEN", fromUsername, toUsername, fen, gameUrl).then(() => { });
    }

    public sendBoardState = (fromUsername: string, toUsername: string, boardState: string, gameUrl: string) => {
        this.connection.send("sendBoardState", fromUsername, toUsername, boardState, gameUrl).then(() => { });
    }

    public static getInstance(username: string, gameUrl: string): ChessConnector {
        if (!ChessConnector.instance)
            ChessConnector.instance = new ChessConnector(username, gameUrl);
        return ChessConnector.instance;
    }
}
export default ChessConnector.getInstance;