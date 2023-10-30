import * as React from "react";
import { Card, Button, Container } from "react-bootstrap";
import chess from "../../images/chess.png";
import { Link } from "react-router-dom";


export const ChessCard = () => {
    return(
        <>
            <Card id="game-card">
                <Card.Img variant="top" src={chess} alt="Chess-game-wallpaper"/>
                <Card.Body id="game-card-body">
                    <Card.Title id="game-card-title">Chess</Card.Title>
                    <Card.Text className="mt-3">
                        Chess is a timeless board game that's easy to learn yet offers endless depth, 
                        making it a favorite pastime for players of all ages. Let's play now!
                    </Card.Text>
                    <Container id="game-card-btn-container">
                        <Link to="/chess">
                            <Button variant="primary" className="ml-3 mr-3" id="game-card-btn">Play offline</Button>
                        </Link>
                        <Button variant="primary" className="ml-3 mr-3" id="game-card-btn" disabled>Play online</Button>
                    </Container>
                </Card.Body>
            </Card>
        </>
    );
}


export default ChessCard;