using GamePortal.Models;

namespace GamePortal.Security
{
    public class AuthenticatedResponse
    {
        public int RoleId { get; set; }
        public Player? player {  get; set; }
        public string? Token { get; set; }
    }
}
