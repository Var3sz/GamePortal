namespace GamePortal.Models
{
    public class AuthenticatedResponse
    {
        public List<int>? roleIds { get; set; }
        public string? Token { get; set; }
        public string? RefreshToken { get; set; }
    }
}
