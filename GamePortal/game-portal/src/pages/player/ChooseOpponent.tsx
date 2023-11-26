import { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { Container, Heading, Divider } from '@chakra-ui/react';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Player } from "../../models/player.model";
import useAxiosPrivate from "../../auth/useAxiosPrivate";
import OpponentList from "../../components/Game/OpponentList";
import useAuth from "../../auth/useAuth";
import { initialAuth } from "../../auth/AuthProvider";

export const ChooseOpponent = () => {
    const [opponents, setOpponents] = useState<Player[]>([]);
    const { gameType } = useParams();

    const axiosPrivate = useAxiosPrivate();

    const { setAuth } = useAuth();

    const location = useLocation();
    const navigate = useNavigate();


    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getOpponents = async () => {
            try {
                const response = await axiosPrivate.get("/api/players", {
                    signal: controller.signal
                });
                isMounted && setOpponents(response.data);
            } catch (error: any) {
                console.error(error);
                setAuth(initialAuth);
                sessionStorage.removeItem("player");
                sessionStorage.removeItem('accessToken');
                sessionStorage.removeItem('refreshToken');
                navigate('/login', { state: { from: location }, replace: true });
            }
        };

        getOpponents();

        const intervalId = setInterval(() => {
            getOpponents();
        }, 500);

        return () => {
            isMounted = false;
            controller.abort();
            clearInterval(intervalId);
        };
    }, [axiosPrivate, location, navigate]);

    return (
        <Container className="px-0" maxW={"70%"}>
            <Container className="mb-5">
                <Row className="justify-content-center">
                    <Col className="mt-5" align="center" lg={12} md={10} sm={12}>
                        <Heading>Choose an opponent you want to play against</Heading>
                    </Col>
                </Row>
            </Container>
            <Divider variant={'custom'} width={'25%'} />
            <Row className="justify-content-center mx-0 mt-5">
                <Col lg={8} md={10} sm={12} align="center">
                    {opponents.length > 1 ?
                        (<OpponentList
                            opponents={opponents}
                            gameType={gameType}
                        ></OpponentList>) : (
                            <Heading className="h2"> No opponents to display </Heading>
                        )}
                </Col>
            </Row>
        </Container>
    );
};

export default ChooseOpponent;