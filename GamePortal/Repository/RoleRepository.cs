using GamePortal.Models;

namespace GamePortal.Repository
{
    public class RoleRepository : IRoleRepository
    {
        private readonly GamePortalDbContext _dbContext;

        public RoleRepository(GamePortalDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public List<Role> GetRoles()
        {
            return _dbContext.Roles.ToList();
        }
        public Role GetRoleById(int id)
        {
            return _dbContext.Roles.SingleOrDefault(q => q.RoleId == id)!;
        }
        public Role GetRoleByName(string role)
        {
            return _dbContext.Roles.SingleOrDefault(q => q.Name == role)!;
        }
        public List<int> GetRoleIdsByPlayerId(int playerId)
        {
            var roles = _dbContext.Roles.Where(r => r.Players.Any(p => p.PlayerId == playerId)).ToList();
            return roles.Select(r => r.RoleId).ToList();
        }


    }
}
