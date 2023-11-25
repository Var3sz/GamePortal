import chess from "../../images/chess.png";
import useAuth from "../../auth/useAuth";
import GameCard from "../Game/GameCard";


export const ChessCard = () => {
    const { auth } = useAuth();
    const title = "Chess";
    const description = `Chess is a timeless board game that's easy to learn yet offers endless depth,
    making it a favorite pastime for players of all ages. Let's play now!`;
    const offlineLink = "/chess"
    const onlineLink = "/onlineGame/Chess"
    const isPlayable = true;
    const isAuthorized = auth.player.roles.some((role: any) => role.roleId === 1);

    return (
        <GameCard
            title={title}
            imageURL={chess}
            description={description}
            offlineLink={offlineLink}
            onlineLink={onlineLink}
            isPlayable={isPlayable}
            isAuthorized={isAuthorized}
        />
    );
}

export default ChessCard;