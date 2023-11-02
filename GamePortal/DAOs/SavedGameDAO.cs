using GamePortal.Models;

namespace GamePortal.DAOs
{
    public class SavedGameDAO
    {
        public void RemoveSavedGames(int playerId)
        {
            /*using (GamePortalDbContext context = new GamePortalDbContext())
            {
                context.SavedGames.RemoveRange(context.SavedGames.Where(q => q.PlayerId == playerId));
                context.SaveChanges();
            }*/
        }
    }
}
