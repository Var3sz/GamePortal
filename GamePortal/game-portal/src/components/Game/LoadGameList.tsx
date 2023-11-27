import React from "react";
import { TableContainer, Table, Thead, Tr, Th, Tbody } from "@chakra-ui/react";
import { SavedGame } from "../../models/savedGame.model";
import { customColors } from "../../theme/theme";
import LoadGameListRow from "./LoadGameListRow";

interface LoadGameListProps {
    games: SavedGame[];
    gameType?: string;
}

export const LoadGameList: React.FC<LoadGameListProps> = ({ games, gameType }) => {
    const validGames = games.filter((game) => game.game.name === gameType);

    return (
        <TableContainer>
            <Table variant={'striped'} size="lg">
                <Thead color={customColors.secondary} backgroundColor={customColors.primary}>
                    <Tr>
                        <Th width={'10%'} color={customColors.secondary}>Sorszám</Th>
                        <Th width={'10%'} color={customColors.secondary}>Game</Th>
                        <Th width={'10%'} color={customColors.secondary}>Player One</Th>
                        <Th width={'10%'} color={customColors.secondary}>Player Two</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {validGames
                        .map(game => (
                            <LoadGameListRow
                                game={game}
                                gameType={gameType}
                                key={game.savedGameId}
                            ></LoadGameListRow>
                        ))}
                </Tbody>
            </Table>
        </TableContainer>
    );
};


export default LoadGameList;