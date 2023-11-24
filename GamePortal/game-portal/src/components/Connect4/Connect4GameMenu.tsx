import { Card, CardBody, Heading, Text } from "@chakra-ui/react";

export const Connect4Menu = ({ renderGameStatus, currentPlayer }: any) => {
    return (
        <Card boxShadow="md" maxW="lg">
            <CardBody>
                <Heading>Connect4</Heading>
                <Text mt={'5px'}>{renderGameStatus}</Text>
                <Text>Current player: {currentPlayer}</Text>
            </CardBody>
        </Card>
    );
};

export default Connect4Menu;