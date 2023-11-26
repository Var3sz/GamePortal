import { Container, Heading, Divider } from '@chakra-ui/react';
import { Row, Col } from "react-bootstrap";
import axios from '../../api/axios';
import useAuth from '../../auth/useAuth';
import { useEffect, useState } from 'react';
import { SavedGame } from '../../models/savedGame.model';
import { useParams } from 'react-router-dom';
import LoadGameList from '../../components/Game/LoadGameList';



export const ChooseGame = () => {
    const { auth } = useAuth();
    const { gameType } = useParams();
    const [games, setGames] = useState<SavedGame[]>([]);

    useEffect(() => {
        const getSavedGames = async () => {
            try {
                const response = await axios.get(`/api/savedgames/games/${auth.player.playerId}`);
                setGames(response.data);
            } catch (error: any) {
                console.error(error);
            }
        };

        getSavedGames();

        const intervalId = setInterval(() => {
            getSavedGames();
        }, 500);
    }, []);


    return (
        <Container className="px-0" maxW={"100%"}>
            <Container className="mb-5">
                <Row className="justify-content-center">
                    <Col className="mt-5" align="center" lg={12} md={10} sm={12}>
                        <Heading>Choose a game to continue</Heading>
                    </Col>
                </Row>
            </Container>
            <Divider variant={'custom'} width={'25%'} />
            <Row className="justify-content-center mx-0 mt-5">
                <Col lg={8} md={10} sm={12} align="center">
                    {games.length > 0 ?
                        (<LoadGameList
                            games={games}
                            gameType={gameType}
                        ></LoadGameList>) : (
                            <Heading className="h2"> No games started </Heading>
                        )}
                </Col>
            </Row>
        </Container>
    );
};

export default ChooseGame;