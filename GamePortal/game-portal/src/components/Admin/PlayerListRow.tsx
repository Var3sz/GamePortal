import * as React from "react";
import { Tr, Td } from '@chakra-ui/react';
import { Player } from "../../models/player.model";
import { useState } from "react";
import RemovePlayerModal from "./RemovePlayerModal";

/**
 * 2022-23 Őszi félév
 * Témalaborból merítve, átdolgozva
 */

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
      <Tr>
        <RemovePlayerModal
          show={showRemovePlayer}
          close={() => setShowRemovePlayer(false)}
          player={player}
          playerChangedListener={playerChangedListener}
        />
        <Td onClick={() => setShowRemovePlayer(true)}>{player.userName}</Td>
        <Td onClick={() => setShowRemovePlayer(true)}>{player.fullName}</Td>
        <Td onClick={() => setShowRemovePlayer(true)}>{player.email}</Td>
        <Td onClick={() => setShowRemovePlayer(true)}>{formatBirthdateString(player.birthdate)}</Td>
      </Tr>
    </>
  );
};

export default PlayerListRow;