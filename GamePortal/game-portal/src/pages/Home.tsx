import { Container, Row, Col } from 'react-bootstrap';
import ChessCard from '../components/Chess/ChessCard';
import Connect4Card from '../components/Connect4/Connect4Card';
import TicTacToeCard from '../components/TicTacToe/TicTacToeCard';
import { UserContext } from '../UserContext';
import { useContext } from 'react';

export const Home = () => {
  const userContext = useContext(UserContext);

  return (
    <>
      <Row className="mt-1">
        <Col className="col-lg-4 col-md-6 col-sm-12">
          <Container className="d-flex justify-content-evenly col-lg- mt-3">
            <ChessCard />
          </Container>
        </Col>
        <Col className="col-lg-4 col-md-6 col-sm-12">
          <Container className="d-flex justify-content-evenly col-lg- mt-3">
            <Connect4Card />
          </Container>
        </Col>
        <Col className="col-lg-4 col-md-6 col-sm-12">
          <Container className="d-flex justify-content-evenly col-lg- mt-3">
            <TicTacToeCard />
          </Container>
        </Col>
      </Row>
    </>
  );
}

export default Home;