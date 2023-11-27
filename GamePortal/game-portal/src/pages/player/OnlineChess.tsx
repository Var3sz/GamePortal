import { useParams } from "react-router-dom";
import Referee from "../../components/Chess/Referee";
import axios from "../../api/axios";
import useAuth from "../../auth/useAuth";
import { SavedGame } from "../../models/savedGame.model";
import { useEffect, useState } from "react";

export const OnlineChess = () => {
  const isMultiplayer = true;
  const { auth } = useAuth();
  const { variant, id, enemyId } = useParams();  // Using this for POST request, only way I could solve it
  const isNewGame = variant === "new" ? true : false;
  const [savedGame, setSavedGame] = useState<SavedGame>();

  /* Creating a newGame when player chooses this option */
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
    }
  };

  const loadGame = async () => {
    try {
      const response = await axios.get(`/api/savedgames/gameurl/${id}`);
      setSavedGame((prevSavedGame) => {
        return response.data;
      });
      console.log(response.data);
    } catch (error: any) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isNewGame) {
      newGame();
    } else {
      loadGame();
    }
  }, []);


  return (
    <Referee isMultiplayer={isMultiplayer} isNewGame={isNewGame} savedGame={savedGame} />
  )
}

export default OnlineChess;