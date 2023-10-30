import * as React from "react";
import {  Row, Col, Form, Container } from "react-bootstrap";
import NavLink from "react-router-dom";
import PlayerList from "../components/Admin/PlayerList";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../UserContext";
import { Player } from "../models/player.model";


//Static data for testing
const staticPlayers = [
  {
    playerId: 1,
    fullname: "Varga Adam",
    username: "Varesz",
    password: "pass1", 
    email: "varga.adam011208@gmail.com",
    birth: "2001-12-08"
  },
  {
    playerId: 2,
    fullname: "Antal Ádám",
    username: "Tóni",
    password: "pass2",
    email: "antal.toni@gmail.com",
    birth: "2002-04-28"
  }
];

//TODO: Dynamic users by api and correct way of UserContext 
export const ManagePlayers = () => {

  const userContext = useContext(UserContext);
  const [players, setInvestors] = useState<Player[]>([]);
  const [playerChanged, setPlayerChanged] = useState(false);

  const playerChangedListener = () => {
    setPlayerChanged((playerChanged) => !playerChanged);
  };

  useEffect(() => {
    getInvestors();
  }, [playerChanged]);

  const getInvestors = () => {
    if (userContext?.player?.username === "admin") {
      fetch("api/players")
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
              players={staticPlayers}
              playerChangedListener={() => {}}
            ></PlayerList>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ManagePlayers;

