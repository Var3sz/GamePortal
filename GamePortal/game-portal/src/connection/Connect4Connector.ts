import * as signalR from "@microsoft/signalr";

const Connect4URL = "http://localhost:5086/connect4hub";

class Connect4Connector {
    private connection: signalR.HubConnection;
    public events: (OnBoardStateReceived: (boardState: string) => void) => void;
    static instance: Connect4Connector;
    constructor() {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(Connect4URL)
            .withAutomaticReconnect()
            .build();
        this.connection.start().catch(err => document.write(err));
        this.events = (OnBoardStateReceived) => {
            this.connection.on("receiveBoardState", (boardState) => {
                OnBoardStateReceived(boardState);
            });
        };
    }

    public sendBoardState = (boardState: string) => {
        this.connection.send("sendBoardState", boardState).then(() => console.log("BoardState sent"));
    }

    public static getInstance(): Connect4Connector {
        if (!Connect4Connector.instance)
            Connect4Connector.instance = new Connect4Connector();
        return Connect4Connector.instance;
    }
}
export default Connect4Connector.getInstance;