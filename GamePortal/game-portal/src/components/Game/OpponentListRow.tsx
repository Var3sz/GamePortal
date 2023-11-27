import React from "react";
import { Player } from "../../models/player.model";
import { Tr, Td } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

interface OpponentListRowProps {
    opponent: Player;
    gameType?: string;
}


export const OpponentListRow: React.FC<OpponentListRowProps> = ({ opponent, gameType }) => {
    const navigate = useNavigate();

    function generateRandomString(): string {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';

        for (let i = 0; i < 7; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }

        return result;
    }

    const gameIdentifier = generateRandomString();

    return (
        <Tr>
            <Td onClick={() => { navigate(`/online${gameType}/new/${gameIdentifier}/${opponent.playerId}`) }}>{opponent.userName}</Td>
        </Tr>
    );
};


export default OpponentListRow;