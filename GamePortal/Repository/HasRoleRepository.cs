using GamePortal.Models;

namespace GamePortal.Repository
{
    public class HasRoleRepository : IHasRoleRepository
    {
        private readonly GamePortalDbContext _dbContext;

        public HasRoleRepository(GamePortalDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public void RemoveHasRoles(int playerId)
        {
            _dbContext.HasRoles.RemoveRange(_dbContext.HasRoles.Where(q => q.PlayerId == playerId));
            _dbContext.SaveChanges();
        }
    }
}
