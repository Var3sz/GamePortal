using GamePortal.Models;

namespace GamePortal.DAOs
{
    public class PlayerDAO
    {
        /* Get all Players from database */
        public List<Player> GetPlayers()
        {
            List<Player> players = new List<Player>();
            using (GamePortalDbContext context = new GamePortalDbContext())
            {
                players = context.Players.ToList();
            }
            return players;
        }

        /* Get Player by username and password */
        public Player GetPlayer(string userName, string password)
        {
            Player player = new Player();
            using (GamePortalDbContext context = new GamePortalDbContext())
            {
                player = context.Players.SingleOrDefault(q => q.UserName == userName && q.Password == password)!;
            }
            return player;
        }

        /* Get Player by ID */
        public Player GetPlayerById(int playerId)
        {
            Player investor = new Player();
            using (GamePortalDbContext context = new GamePortalDbContext())
            {
                investor = context.Players.SingleOrDefault(q => q.PlayerId == playerId)!;
            }
            return investor;
        }

        /* Insert player into Database */
        public void InsertPlayer(Player player)
        {
            using (GamePortalDbContext context = new GamePortalDbContext())
            {
                context.Players.Add(player);
                context.SaveChanges();
            }
        }


        /* Remove player from Database */
        public void RemovePlayer(Player player)
        {
            using (GamePortalDbContext context = new GamePortalDbContext())
            {
                context.Players.Remove(player);
                context.SaveChanges();
            }
        }
    }
}
