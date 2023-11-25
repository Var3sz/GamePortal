import { Row, Col } from "react-bootstrap";
import { Container, Heading, Divider } from '@chakra-ui/react';
import PlayerList from "../../components/Admin/PlayerList";
import { useState, useEffect } from "react";
import { Player } from "../../models/player.model";
import useAxiosPrivate from "../../auth/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../auth/useAuth";
import { initialAuth } from "../../auth/AuthProvider";

/**
 * 2022-23 Őszi félév
 * Témalaborból merítve
 */

export const ManagePlayers = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [playerChanged, setPlayerChanged] = useState(false);

  const axiosPrivate = useAxiosPrivate();

  const { setAuth } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  const playerChangedListener = () => {
    setPlayerChanged((playerChanged) => !playerChanged);
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getOpponents = async () => {
      try {
        const response = await axiosPrivate.get("/api/players", {
          signal: controller.signal
        });
        isMounted && setPlayers(response.data);
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
  }, [axiosPrivate, location, navigate, playerChanged]);

  return (
    <>
      <Container className="px-0" maxW={"full"}>
        <Container className="mb-5">
          <Row className="justify-content-center">
            <Col className="mt-5" align="center" lg={12} md={10} sm={12}>
              <Heading>Track and manage user information</Heading>
            </Col>
          </Row>
        </Container>
        <Divider variant={'custom'} width={'25%'} />
        <Row className="justify-content-center mx-0 mt-5">
          <Col lg={8} md={10} sm={12} align="center">
            {players.length > 1 ?
              (<PlayerList
                players={players}
                playerChangedListener={playerChangedListener}
              ></PlayerList>) : (
                <Heading className="h2"> No users to display </Heading>
              )}
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ManagePlayers;

