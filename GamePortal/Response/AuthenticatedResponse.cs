using GamePortal.Models;

namespace GamePortal.Response
{
    public class AuthenticatedResponse
    {
        public Player? player { get; set; }
        public string? Token { get; set; }
        public string? RefreshToken { get; set; }
    }
}
