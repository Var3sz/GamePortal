import * as React from "react";
import { TableContainer, Table, Thead, Tbody, Tr, Th } from '@chakra-ui/react';
import { Player } from "../../models/player.model";
import PlayerListRow from "./PlayerListRow";
import { customColors } from "../../theme/theme";

/**
 * 2022-23 Őszi félév
 * Témalaborból merítve, átdolgozva
 */

interface IPlayerListProps {
  players: Player[];
  playerChangedListener: () => void;
}

const PlayerList: React.FunctionComponent<IPlayerListProps> = ({
  players,
  playerChangedListener,
}) => {

  return (
    <TableContainer>
      <Table variant={'striped'} size="lg">
        <Thead color={customColors.secondary} backgroundColor={customColors.primary}>
          <Tr>
            <Th width={'12%'} color={customColors.secondary}>Username</Th>
            <Th width={"15%"} color={customColors.secondary}>Fullname</Th>
            <Th width={"20%"} color={customColors.secondary}>Email</Th>
            <Th width={"15%"} color={customColors.secondary}>Birth</Th>
          </Tr>
        </Thead>
        <Tbody>
          {players
            .filter(player => !player.roles.some((role: any) => role.name === 'admin'))
            .map(player => (
              <PlayerListRow
                player={player}
                playerChangedListener={playerChangedListener}
                key={player.playerId}
              ></PlayerListRow>
            ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default PlayerList;