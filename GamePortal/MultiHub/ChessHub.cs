using Microsoft.AspNetCore.SignalR;

namespace GamePortal.MultiHub
{
    public class ChessHub : Hub
    {
        public async Task NewMessage(string user, string message)
        {
            await Clients.All.SendAsync("messageReceived", user, message);
        }

        public async Task SendFEN(string fen)
        {
            await Clients.All.SendAsync("ReceiveFEN", fen);
        }
    }
}

