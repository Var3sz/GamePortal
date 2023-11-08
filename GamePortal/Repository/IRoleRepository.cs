using GamePortal.Models;

namespace GamePortal.Repository
{
    public interface IRoleRepository
    {
        List<Role> GetRoles();
        Role GetRoleByName(string role);
        Role GetRoleById(int id);
    }
}
