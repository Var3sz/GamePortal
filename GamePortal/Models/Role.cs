namespace GamePortal.Models
{
    public partial class Role
    {
        public int RoleId { get; set; }
        public string Name { get; set; } = null!;

        public List<Player> Players { get; set; } = new();
    }
}
