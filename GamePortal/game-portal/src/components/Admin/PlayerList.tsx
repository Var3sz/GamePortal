import * as React from "react";
import { useContext } from "react";
import { Table } from "react-bootstrap";
import { Player } from "../../models/player.model";
import { UserContext } from "../../UserContext";
import PlayerListRow from "./PlayerListRow";

interface IPlayerListProps{
    players: Player[];
    playerChangedListener: () => void;
}

const PlayerList: React.FunctionComponent<IPlayerListProps> = ({
    players,
    playerChangedListener,
}) =>{
    const userContext = useContext(UserContext);

    return (
        <>
          <Table striped bordered hover>
            <thead className="table-header-row">
              <tr>
                <th style={{ width: "12%" }}>Username</th>
                <th style={{ width: "15%" }}>Full Name</th>
                <th style={{ width: "20%" }}>Email</th>
                <th style={{ width: "15%" }}>Birth</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player) => (
                <PlayerListRow
                  player={player}
                  playerChangedListener={playerChangedListener}
                  key={player.playerId}
                ></PlayerListRow>
              ))}
            </tbody>
          </Table>
        </>
      );
};

export default PlayerList;