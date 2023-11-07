using GamePortal.Models;

namespace GamePortal.Security
{
    public class AuthenticatedResponse
    {
        public Player? player {  get; set; }
        public string? Token { get; set; }
    }
}
