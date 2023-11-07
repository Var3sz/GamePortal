namespace GamePortal.DTOs
{
    public class RegisterDTO
    {
        public int? PlayerId { get; set; }
        public string? FullName { get; set; }
        public string? UserName { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public DateTime Birthdate { get; set; }
    }
}
