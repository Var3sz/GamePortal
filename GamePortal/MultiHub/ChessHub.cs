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
        public async Task RegisterUsers(string name, string message)
        {
                PlayerHandler.AddOrUpdateConnectionId(name, Context.ConnectionId);

            await Clients.All.SendAsync("userRegistered", name, message);
        }

        /* Send fen to enemy and to the caller as well */
        public async Task SendFen(string fromUsername, string toUsername, string fen)
        {
            string fromUserId = Context.ConnectionId;
            string toUserId = PlayerHandler.GetConnectionIdByUsername(toUsername);

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

    }

    /*
     Source: 
     https://stackoverflow.com/questions/69834362/how-can-i-send-signalr-message-to-a-single-client
     */
    public static class PlayerHandler
    {
        private static Dictionary<string, string> UserToConnectionIdMap = new Dictionary<string, string>();

        public static void AddOrUpdateConnectionId(string username, string connectionId)
        {
            if (UserToConnectionIdMap.ContainsKey(username))
            {
                UserToConnectionIdMap[username] = connectionId;
            }
            else
            {
                UserToConnectionIdMap.Add(username, connectionId);
            }
        }

        public static string GetConnectionIdByUsername(string username)
        {
            if (UserToConnectionIdMap.TryGetValue(username, out var connectionId))
            {
                return connectionId;
            }

            return null; // The user is not connected right now
        }

        // Other methods and properties...
    }
}

