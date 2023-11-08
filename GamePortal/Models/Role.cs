using System;
using System.Collections.Generic;

namespace GamePortal.Models
{
    public partial class Role
    {
        public Role()
        {
            HasRoles = new HashSet<HasRole>();
        }

        public int RoleId { get; set; }
        public string Name { get; set; } = null!;

        public virtual ICollection<HasRole> HasRoles { get; set; }
    }
}
