import * as signalR from "@microsoft/signalr";
const URL = "http://localhost:5086/chesshub"; //or whatever your backend port is
class Connector {
    private connection: signalR.HubConnection;
    public events: (onMessageReceived: (username: string, message: string) => void) => void;
    static instance: Connector;
    constructor() {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(URL)
            .withAutomaticReconnect()
            .build();
        this.connection.start().catch(err => document.write(err));
        this.events = (onMessageReceived) => {
            this.connection.on("messageReceived", (username, message) => {
                onMessageReceived(username, message);
            });
        };
    }
    public newMessage = (messages: string) => {
        this.connection.send("newMessage", "foo", messages).then(x => console.log("sent"))
    }

    public sendFEN = (fen: string) => {
        this.connection.send("sendFEN", fen).then(() => console.log("Sent FEN"));
    }

    // Add a new method to receive FEN from the hub
    public receiveFEN = (onFENReceived: (fen: string) => void) => {
        this.connection.on("receiveFEN", (fen) => {
            onFENReceived(fen);
        });
    }

    public static getInstance(): Connector {
        if (!Connector.instance)
            Connector.instance = new Connector();
        return Connector.instance;
    }
}
export default Connector.getInstance;