import * as React from "react";
import { Player } from "../../models/player.model";
import { useContext, useState } from "react";
import { UserContext } from "../../UserContext";
import RemovePlayerModal from "./RemovePlayerModal";


interface IPlayerListRowProps{
    player: Player;
    playerChangedListener: () => void;
}

const PlayerListRow: React.FunctionComponent<IPlayerListRowProps> = ({
    player,
    playerChangedListener,
}) => {
    const [showRemovePlayer, setShowRemovePlayer] = useState(false);
    const userContext = useContext(UserContext);

    return (
        <>
          <tr>
            {userContext?.player ? (
              <></>
            ) : (
              <RemovePlayerModal
                show={showRemovePlayer}
                close={() => setShowRemovePlayer(false)}
                player={player}
                playerChangedListener={playerChangedListener}
              />
            )}
            <td onClick={() => setShowRemovePlayer(true)}>{player.username}</td>
            <td onClick={() => setShowRemovePlayer(true)}>{player.fullname}</td>
            <td onClick={() => setShowRemovePlayer(true)}>{player.email}</td>
            <td onClick={() => setShowRemovePlayer(true)}>{player.birth}</td>
          </tr>
        </>
      );
};

export default PlayerListRow;