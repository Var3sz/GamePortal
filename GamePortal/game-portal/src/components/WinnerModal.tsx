import React from "react";
import { Modal, Button, Form, Image, Container } from "react-bootstrap";
import trophy from '../images/trophy.png';

interface WinnerModalProps {
  show: boolean
  winnerName: string;
  onClose: () => void;
}

const WinnerModal: React.FunctionComponent<WinnerModalProps> = ({ show, winnerName, onClose }) => {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton id="winner-modal-header">
        <Modal.Title>
          <Container>
            Winner
            <Image id="trophy" src={trophy} alt="Trophy" />
          </Container>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body id="winner-modal-body">
        <Container>
          <Form.Text>Congratulations, <strong>{winnerName}</strong>!</Form.Text>
          <Form.Text className="mt-3">You are the winner.</Form.Text>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onClose} id="restart-btn">
          Restart
        </Button>
        <Button variant="danger" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default WinnerModal;