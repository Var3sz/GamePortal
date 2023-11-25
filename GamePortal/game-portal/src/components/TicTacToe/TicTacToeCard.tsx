import tictactoe from "../../images/tictactoe.png"
import GameCard from "../Game/GameCard";
import useAuth from "../../auth/useAuth";

export const TicTacToeCard = () => {
    const { auth } = useAuth();
    const title = "TicTacToe";
    const description = `Tic-tac-toe is a beloved two-player game,
    is all about taking turns to mark spots on a paper or board in an attempt
    to form a winning line of three. Let's play now!`;
    const offlineLink = "/tictactoe"
    const onlineLink = "/tictactoe"
    const isPlayable = false;
    const isAuthorized = auth.player.roles.some((role: any) => role.roleId === 1);

    return (
        <GameCard
            title={title}
            imageURL={tictactoe}
            description={description}
            offlineLink={offlineLink}
            onlineLink={onlineLink}
            isPlayable={isPlayable}
            isAuthorized={isAuthorized}
        />
    );
}

export default TicTacToeCard;