import { useParams } from "react-router-dom";
import useAuth from "../../auth/useAuth";
import Connect4Referee from "../../components/Connect4/Connect4Referee";
import { useEffect, useState } from "react";
import { SavedGame } from "../../models/savedGame.model";
import axios from "../../api/axios";

export const OnlineConnect4 = () => {
  const isMultiplayer = true;
  const { auth } = useAuth();
  const { variant, id, enemyId } = useParams();
  const isNewGame = variant === "new" ? true : false;
  const [savedGame, setSavedGame] = useState<SavedGame>();

  /* Creating a newGame when player chooses this option */
  const newGame = async () => {
    try {
      const response = await axios.post("/api/savedgames",
        JSON.stringify({
          GameId: 2,      // Connect4 a kettes ID
          GameUrl: id,
          GameState: "[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]",
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
    <>
      <Connect4Referee isMultiplayer={isMultiplayer} isNewGame={isNewGame} savedGame={savedGame} />
    </>
  )
}

export default OnlineConnect4;