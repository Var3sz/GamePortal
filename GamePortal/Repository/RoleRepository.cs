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

        public Role GetRoleById(int id)
        {
            return _dbContext.Roles.SingleOrDefault(q => q.RoleId == id)!;
        }

        public Role GetRoleByName(string role)
        {
            return _dbContext.Roles.SingleOrDefault(q => q.Name == role)!;
        }

        public List<Role> GetRoles()
        {
            return _dbContext.Roles.ToList();
        }
    }
}
