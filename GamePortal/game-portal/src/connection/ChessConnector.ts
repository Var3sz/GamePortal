import * as signalR from "@microsoft/signalr";

const ChessHubURL = "http://localhost:5086/chesshub";

class ChessConnector {
    private connection: signalR.HubConnection;
    public events: (onFENReceived: (fen: string) => void) => void;
    static instance: ChessConnector;
    constructor() {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(ChessHubURL)
            .withAutomaticReconnect()
            .build();
        this.connection.start().catch(err => document.write(err));
        this.events = (onFENReceived) => {
            this.connection.on("receiveFEN", (fen) => {
                onFENReceived(fen);
            });
        };
    }

    public sendFEN = (fen: string) => {
        this.connection.send("sendFEN", fen).then(() => console.log("Sent FEN"));
    }

    public static getInstance(): ChessConnector {
        if (!ChessConnector.instance)
            ChessConnector.instance = new ChessConnector();
        return ChessConnector.instance;
    }
}
export default ChessConnector.getInstance;