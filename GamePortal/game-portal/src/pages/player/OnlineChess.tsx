import { useParams } from "react-router-dom";
import Referee from "../../components/Chess/Referee";
import axios from "../../api/axios";
import useAuth from "../../auth/useAuth";
import { SavedGame } from "../../models/savedGame.model";
import { useEffect, useState } from "react";

export const OnlineChess = () => {
  const isMultiplayer = true;
  const { auth } = useAuth();
  const { variant, id, enemyId } = useParams();
  const isNewGame = variant === "new" ? true : false;
  const [savedGame, setSavedGame] = useState<SavedGame>(); // Use state to manage savedGame
  const [saveCompleted, setSaveCompleted] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state

  const newGame = async () => {
    try {
      const response = await axios.post("/api/savedgames",
        JSON.stringify({
          GameId: 1,      // Sakk az egyes ID
          GameUrl: id,
          GameState: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq 1 n",
          PlayerOneId: auth.player.playerId,
          PlayerTwoId: enemyId
        }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );
      setSavedGame((prevSavedGame) => {
        return response.data;
      });
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false); // Set loading to false regardless of success or failure
      setSaveCompleted(true); // Jelzi, hogy a mentés befejeződött
    }
  };

  useEffect(() => {
    if (isNewGame) {
      newGame();
    }
  }, [isNewGame]);


  return !loading && saveCompleted ? (
    <Referee isMultiplayer={isMultiplayer} isNewGame={isNewGame} savedGame={savedGame} />
  ) : (
    <div>Loading...</div>
  );
}

export default OnlineChess;