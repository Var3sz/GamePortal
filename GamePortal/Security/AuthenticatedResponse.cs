using GamePortal.Models;

namespace GamePortal.Security
{
    public class AuthenticatedResponse
    {
        public List<Role>? roles { get; set; }
        public Player? player {  get; set; }
        public string? Token { get; set; }
    }
}
