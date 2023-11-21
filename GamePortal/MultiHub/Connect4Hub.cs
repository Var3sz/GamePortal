using Microsoft.AspNetCore.SignalR;

namespace GamePortal.MultiHub
{
    public class Connect4Hub: Hub
    {
        public async Task SendBoardState(string boardState)
        {
            await Clients.All.SendAsync("ReceiveBoardState", boardState);
        }
    }
}
