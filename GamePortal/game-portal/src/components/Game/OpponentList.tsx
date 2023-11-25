import { Player } from "../../models/player.model";
import { TableContainer, Table, Thead, Tbody, Tr, Th } from '@chakra-ui/react';
import OpponentListRow from "./OpponentListRow";
import { customColors } from "../../theme/theme";
import useAuth from "../../auth/useAuth";

interface OpponentListProps {
    opponents: Player[],
    gameType?: string
}

export const OpponentList: React.FC<OpponentListProps> = ({ opponents, gameType }) => {
    const { auth } = useAuth();
    const validOpponents = opponents.filter((opponent) => opponent.userName !== auth.player.userName);

    return (
        <TableContainer>
            <Table variant={'striped'} size="lg">
                <Thead color={customColors.secondary} backgroundColor={customColors.primary}>
                    <Tr>
                        <Th width={'100%'} color={customColors.secondary}>Username</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {validOpponents
                        .filter(opponent => !opponent.roles.some((role: any) => role.name === 'admin'))
                        .map(opponent => (
                            <OpponentListRow
                                opponent={opponent}
                                gameType={gameType}
                                key={opponent.playerId}
                            ></OpponentListRow>
                        ))}
                </Tbody>
            </Table>
        </TableContainer>
    );
};


export default OpponentList;