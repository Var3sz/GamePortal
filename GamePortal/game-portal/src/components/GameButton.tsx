import { Button, ButtonProps } from "@chakra-ui/react";
import React from "react";

interface GameButtonProps extends ButtonProps {
    onClick?: () => void;
}

const GameButton: React.FC<GameButtonProps> = ({ children, onClick, disabled }) => {
    return (
        <Button
            variant="gameButton"
            className="ml-3 mr-3"
            isDisabled={disabled}
            onClick={onClick}
        >
            {children}
        </Button>
    );
};

export default GameButton;