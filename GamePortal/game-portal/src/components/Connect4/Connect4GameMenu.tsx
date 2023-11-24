import { Container, Heading, Text } from "@chakra-ui/react";

export const Connect4Menu = ({ renderGameStatus, currentPlayer }: any) => {
    return (
        <Container>
            <Heading>Connect4</Heading>
            <Text mt={'5px'}>{renderGameStatus}</Text>
            <Text>Current player: {currentPlayer}</Text>
        </Container>
    );
};

export default Connect4Menu;