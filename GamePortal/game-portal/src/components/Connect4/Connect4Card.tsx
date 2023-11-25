import connect4 from "../../images/connect4.png"
import useAuth from "../../auth/useAuth";
import GameCard from "../Game/GameCard";


export const Connect4Card = () => {
    const { auth } = useAuth();
    const title = "Connect4";
    const description = `Connect4 is a strategic two-player game where 
    you need to create a line of four either horizontally, 
    vertically, or diagonally on the grid. Let's play now!`;
    const offlineLink = "/connect4"
    const onlineLink = "/onlinegame/Connect4"
    const isPlayable = true;
    const isAuthorized = auth.player.roles.some((role: any) => role.roleId === 1);

    return (
        <GameCard
            title={title}
            imageURL={connect4}
            description={description}
            offlineLink={offlineLink}
            onlineLink={onlineLink}
            isPlayable={isPlayable}
            isAuthorized={isAuthorized}
        />
    );
}


export default Connect4Card;