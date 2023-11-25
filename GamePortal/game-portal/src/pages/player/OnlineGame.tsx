import { useState } from "react";
import OnlineGameModal from "../../components/Game/OnlineGameModal";
import { useNavigate, useParams } from "react-router-dom";

interface OnlineGameProps { }

export const OnlineGame: React.FC<OnlineGameProps> = () => {
    const [modalState, setModalState] = useState(true);
    const navigate = useNavigate();
    const { gameType } = useParams();
    const welcomeMessage = `Welcome to online ${gameType}!`;


    const startNewGame = () => {
        navigate(`/chooseopponent/${gameType}`);
        setModalState(false);
    };

    const loadGame = () => {
        setModalState(false);
    };

    return (
        <OnlineGameModal isOpen={modalState} welcomeMessage={welcomeMessage} onStartNewGame={startNewGame} onLoadGame={loadGame} />
    );
};

export default OnlineGame;