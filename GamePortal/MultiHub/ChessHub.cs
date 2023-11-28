using Microsoft.AspNetCore.SignalR;

namespace GamePortal.MultiHub
{
    public class ChessHub : Hub
    {

        /*public async Task SendFen(string fen)
        {
            await Clients.All.SendAsync("ReceiveFEN", fen);
        }*/

        /* Register the connected users */
        public async Task RegisterUsers(string name, string message, string gameUrl)
        {
                PlayerHandler.AddOrUpdateConnectionId(name, Context.ConnectionId, gameUrl);

            await Clients.All.SendAsync("userRegistered", name, message);
        }

        /* Send fen to enemy and to the caller as well */
        public async Task SendFen(string fromUsername, string toUsername, string fen, string gameIdentifier)
        {
            string fromUserId = Context.ConnectionId;
            string toUserId = PlayerHandler.GetConnectionIdByUsernameAndGame(fromUsername, toUsername, gameIdentifier);

            if (toUserId != null && fromUserId != null)
            {
                Console.WriteLine($"Sending FEN from {fromUserId} to {toUserId}: {fen}");
                await Clients.Client(toUserId).SendAsync("receiveFen", fen);
            }
            else
            {
                Console.WriteLine($"Unable to send FEN. fromUserId: {fromUserId}, toUserId: {toUserId}");
            }
        }
        
        public async Task SendBoardState(string fromUsername, string toUsername, string boardState, string gameIdentifier)
        {
            string fromUserId = Context.ConnectionId;
            string toUserId = PlayerHandler.GetConnectionIdByUsernameAndGame(fromUsername, toUsername, gameIdentifier);

            Console.WriteLine(boardState);

            if (toUserId != null && fromUserId != null)
            {
                Console.WriteLine($"Sending BoardState from {fromUserId} to {toUserId}: {boardState}");
                await Clients.Client(toUserId).SendAsync("receiveBoardState", boardState);
            }
            else
            {
                Console.WriteLine($"Unable to send BoardState. fromUserId: {fromUserId}, toUserId: {toUserId}");
            }
        }


    }

    /*
     Source: 
     https://stackoverflow.com/questions/69834362/how-can-i-send-signalr-message-to-a-single-client
     */
    public static class PlayerHandler
    {
        private static Dictionary<(string, string), string> UserToConnectionIdMap = new Dictionary<(string, string), string>();

        public static void AddOrUpdateConnectionId(string username, string connectionId, string gameIdentifier)
        {
            var key = (username, gameIdentifier);

            if (UserToConnectionIdMap.ContainsKey(key))
            {
                UserToConnectionIdMap[key] = connectionId;
            }
            else
            {
                UserToConnectionIdMap.Add(key, connectionId);
            }
        }

        public static string GetConnectionIdByUsernameAndGame(string fromUsername, string toUsername, string gameIdentifier)
        {
            var fromKey = (fromUsername, gameIdentifier);
            var toKey = (toUsername, gameIdentifier);

            if (UserToConnectionIdMap.TryGetValue(toKey, out var connectionId))
            {
                return connectionId;
            }

            return null;
        }
    }
}

