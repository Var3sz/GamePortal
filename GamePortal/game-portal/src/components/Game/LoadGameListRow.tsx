import React from "react";
import { Tr, Td } from "@chakra-ui/react";
import { SavedGame } from "../../models/savedGame.model";
import { useNavigate } from "react-router-dom";

interface LoadGameListRowProps {
    game: SavedGame;
    gameType?: string;
}


export const LoadGameListRow: React.FC<LoadGameListRowProps> = ({ game, gameType }) => {
    const navigate = useNavigate();

    return (
        <Tr>
            <Td onClick={() => { }}>{game.game.name}</Td>
            <Td onClick={() => { }}>{game.playerOne.userName}</Td>
            <Td onClick={() => { }}>{game.playerTwo.userName}</Td>
        </Tr>
    );
};


export default LoadGameListRow;