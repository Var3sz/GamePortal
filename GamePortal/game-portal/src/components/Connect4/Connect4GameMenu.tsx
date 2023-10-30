import * as React from "react";
import { Card, Container } from "react-bootstrap";

export const Connect4Menu = ({ renderGameStatus, currentPlayer } : any) => {

    return(
        <>
            <Card id="connect4-game-menu">
                <Card.Body id="game-card-body">
                    <Card.Title id="game-card-title">Connect4</Card.Title>
                    <Card.Text className="mt-3">
                        {renderGameStatus}
                    </Card.Text>
                    <Container>
                        <Card.Text>
                            Current player: {currentPlayer}
                        </Card.Text>
                    </Container>
                </Card.Body>
            </Card>
        </>
    );
}


export default Connect4Menu;