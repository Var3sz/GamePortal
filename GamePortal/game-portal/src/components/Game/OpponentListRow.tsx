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

    return (
        <Tr>
            <Td onClick={() => { navigate(`/online${gameType}`) }}>{opponent.userName}</Td>
        </Tr>
    );
};


export default OpponentListRow;