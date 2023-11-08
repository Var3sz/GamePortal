import * as React from "react";
import { Player } from "../../models/player.model";
import { useContext, useState } from "react";
import RemovePlayerModal from "./RemovePlayerModal";


interface IPlayerListRowProps {
  player: Player;
  playerChangedListener: () => void;
}


function formatBirthdateString(birthdateString: string) {
  return birthdateString.split('T')[0];
}

const PlayerListRow: React.FunctionComponent<IPlayerListRowProps> = ({
  player,
  playerChangedListener,
}) => {
  const [showRemovePlayer, setShowRemovePlayer] = useState(false);

  return (
    <>
      <tr>
        <RemovePlayerModal
          show={showRemovePlayer}
          close={() => setShowRemovePlayer(false)}
          player={player}
          playerChangedListener={playerChangedListener}
        />
        <></>
        <td onClick={() => setShowRemovePlayer(true)}>{player.userName}</td>
        <td onClick={() => setShowRemovePlayer(true)}>{player.fullName}</td>
        <td onClick={() => setShowRemovePlayer(true)}>{player.email}</td>
        <td onClick={() => setShowRemovePlayer(true)}>{formatBirthdateString(player.birthdate)}</td>
      </tr>
    </>
  );
};

export default PlayerListRow;