import * as React from "react";
import { Card, Button, Container } from "react-bootstrap";
import tictactoe from "../../images/tictactoe.png"
import { Link } from "react-router-dom";

export const TicTacToeCard = () => {
    return(
        <>
            <Card id="game-card">
                <Card.Img variant="top" src={tictactoe} alt="TicTacToe-game-wallpaper" />
                <Card.Body id="game-card-body">
                    <Card.Title id="game-card-title">TicTacToe</Card.Title>
                    <Card.Text className="mt-3">
                        Tic-tac-toe is a beloved two-player game, 
                        is all about taking turns to mark spots on a paper or board in an attempt 
                        to form a winning line of three. Let's play now!
                    </Card.Text>
                    <Container id="game-card-btn-container">
                        <Link to="/chess">
                            <Button variant="primary" className="ml-3 mr-3" id="game-card-btn" disabled>Play offline</Button>
                        </Link>
                        <Button variant="primary" className="ml-3 mr-3" id="game-card-btn" disabled>Play online</Button>
                    </Container>
                </Card.Body>
            </Card>
        </>
    );
}


export default TicTacToeCard;