using Microsoft.AspNetCore.SignalR;

namespace GamePortal.MultiHub
{
    public class ChessHub : Hub
    {
        public async Task SendFEN(string fen)
        {
            await Clients.All.SendAsync("ReceiveFEN", fen);
        }
    }
}

