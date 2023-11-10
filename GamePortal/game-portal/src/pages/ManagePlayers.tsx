import { Row, Col, Container, FormText, Button } from "react-bootstrap";
import PlayerList from "../components/Admin/PlayerList";
import { useState, useEffect } from "react";
import { Player } from "../models/player.model";
import useAxiosPrivate from "../auth/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";

export const ManagePlayers = ({ message }: any) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [playerChanged, setPlayerChanged] = useState(false);

  const axiosPrivate = useAxiosPrivate();

  const location = useLocation();
  const navigate = useNavigate();

  const playerChangedListener = () => {
    setPlayerChanged((playerChanged) => !playerChanged);
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getPlayers = async () => {
      try {
        const response = await axiosPrivate.get("/api/players", {
          signal: controller.signal
        });
        console.log(response.data);
        isMounted && setPlayers(response.data)

      } catch (error: any) {
        console.error(error);
        navigate('/login', { state: { from: location }, replace: true });
      }
    }

    getPlayers();

    return () => {
      isMounted = false;
      controller.abort();
    }
  }, [playerChanged]);

  return (
    <>
      <Container className="px-0" fluid>
        <Container fluid>
          <Row className="justify-content-center">
            <Col className="mt-5" align="start" lg={8} md={10} sm={12}>
              <p className="h1">Manage Users</p>
              <p className="h3">Track and manage user information</p>
            </Col>
          </Row>
        </Container>
        <Row className="justify-content-center my-4 mx-0">
          <Col align="center">
            <Container className="table-horizontal-line"></Container>
          </Col>
        </Row>
        <Row className="justify-content-center mx-0">
          <Col lg={8} md={10} sm={12} align="center">
            {players.length > 1 ? (<PlayerList
              players={players}
              playerChangedListener={playerChangedListener}
            ></PlayerList>) : (
              <FormText className="h2"> No users to display </FormText>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ManagePlayers;

