namespace GamePortal.DTOs
{
    /* Data transfer object which is used during the refresh of JWT */
    public class TokenDTO
    {
        public string? AccessToken { get; set; }
        public string? RefreshToken { get; set; }
    }
}
