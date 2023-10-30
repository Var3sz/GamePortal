import * as React from "react";
import { Card, Button, Container } from "react-bootstrap";
import connect4 from "../../images/connect4.png"
import { Link } from "react-router-dom";


export const Connect4Card = () => {
    return(
        <>
            <Card id="game-card">
                <Card.Img variant="top" src={connect4} alt="Reversi-game-wallpaper"/>
                <Card.Body id="game-card-body">
                    <Card.Title id="game-card-title">Connect4</Card.Title>
                    <Card.Text className="mt-3">
                        Connect4 is a strategic two-player game where you need to create a line of four either horizontally, vertically, or diagonally on the grid. Let's play now!
                    </Card.Text>
                    <Container id="game-card-btn-container">
                        <Link to="/connect4">
                            <Button variant="primary" className="ml-3 mr-3" id="game-card-btn">Play offline</Button>
                        </Link>
                        <Button variant="primary" className="ml-3 mr-3" id="game-card-btn" disabled>Play online</Button>
                    </Container>
                </Card.Body>
            </Card>
        </>
    );
}


export default Connect4Card;