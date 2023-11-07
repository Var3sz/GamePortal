import { Row, Col, Container } from "react-bootstrap";
import PlayerList from "../components/Admin/PlayerList";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../UserContext";
import { Player } from "../models/player.model";

export const ManagePlayers = () => {

  const userContext = useContext(UserContext);

  console.log(userContext?.player?.fullName);

  const [players, setInvestors] = useState<Player[]>([]);
  const [playerChanged, setPlayerChanged] = useState(false);

  const playerChangedListener = () => {
    setPlayerChanged((playerChanged) => !playerChanged);
  };

  useEffect(() => {
    getInvestors();
  }, [playerChanged]);

  const getInvestors = () => {
    if (userContext?.player?.userName === "admin") {    
      fetch("http://localhost:5086/api/players")
        .then((response) => response.json())
        .then((data) => {
          setInvestors(data);
        });
    }
  };


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
            <PlayerList
              players={players}
              playerChangedListener={playerChangedListener}
            ></PlayerList>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ManagePlayers;

