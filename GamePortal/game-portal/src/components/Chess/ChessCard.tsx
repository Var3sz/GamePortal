import * as React from "react";
import { Card, Button, Container, Stack } from "react-bootstrap";
import chess from "../../images/chess.png";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../UserContext";


export const ChessCard = () => {
    const userContext = useContext(UserContext);


    return (
        <>
            <Card id="game-card">
                <Card.Img variant="top" src={chess} alt="Chess-game-wallpaper" />
                <Card.Body id="game-card-body">
                    <Card.Title id="game-card-title">Chess</Card.Title>
                    <Card.Text className="mt-3">
                        Chess is a timeless board game that's easy to learn yet offers endless depth,
                        making it a favorite pastime for players of all ages. Let's play now!
                    </Card.Text>
                    <Container id="game-card-btn-container">
                        {userContext?.player == null ? (
                            <Stack direction="horizontal">
                                <Link to="/chess">
                                    <Button variant="primary" className="ml-3 mr-3" id="game-card-btn">Play offline</Button>
                                </Link>
                                <Button variant="primary" className="ml-3 mr-3" id="game-card-btn" disabled>Play online</Button>
                            </Stack>
                        ) : (
                            <Stack direction="horizontal">
                                <Link to="/chess">
                                    <Button variant="primary" className="ml-3 mr-3" id="game-card-btn">Play offline</Button>
                                </Link>
                                <Link to="/onlinechess">
                                    <Button variant="primary" className="ml-3 mr-3" id="game-card-btn">Play online</Button>
                                </Link>
                            </Stack>
                        )}
                    </Container>
                </Card.Body>
            </Card>
        </>
    );
}


export default ChessCard;