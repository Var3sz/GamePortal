import chess from "../../images/chess.png";
import useAuth from "../../auth/useAuth";
import GameCard from "../GameCard";


export const ChessCard = () => {
    const { auth } = useAuth();
    const title = "Chess";
    const description = `Chess is a timeless board game that's easy to learn yet offers endless depth,
    making it a favorite pastime for players of all ages. Let's play now!`;
    const offlineLink = "/chess"
    const onlineLink = "/onlinechess"
    const isPlayable = true;
    const isAuthorized = auth.roles.includes(1) ? true : false

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