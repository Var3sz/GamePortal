using System;
using System.Collections.Generic;

namespace GamePortal.Models
{
    public partial class HasRole
    {
        public int HasRoleId { get; set; }
        public int RoleId { get; set; }
        public int PlayerId { get; set; }

        public virtual Player Player { get; set; } = null!;
        public virtual Role Role { get; set; } = null!;
    }
}
