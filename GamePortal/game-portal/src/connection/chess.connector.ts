import * as signalR from "@microsoft/signalr";

const ChessHubURL = "http://localhost:5086/chesshub";

class ChessConnector {
    private connection: signalR.HubConnection;
    public events: (onFENReceived: (fen: string) => void) => void;
    static instance: ChessConnector;
    constructor(username: string) {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(ChessHubURL)
            .withAutomaticReconnect()
            .build();
        this.connection.start().catch(err => document.write(err)).then(() => {
            this.registerUser(username, "cső");
        });
        console.log(this.connection.connectionId);
        this.events = (onFENReceived) => {
            this.connection.on("receiveFEN", (fen) => {
                onFENReceived(fen);
            });
        };
    }

    public registerUser = (name: string, message: string) => {
        this.connection.send("registerUsers", name, message).then(() => console.log("Online"));
    }

    public sendFEN = (fromUsername: string, toUsername: string, fen: string) => {
        this.connection.send("sendFEN", fromUsername, toUsername, fen).then(() => console.log("Sent FEN"));
    }

    public static getInstance(username: string): ChessConnector {
        if (!ChessConnector.instance)
            ChessConnector.instance = new ChessConnector(username);
        return ChessConnector.instance;
    }
}
export default ChessConnector.getInstance;