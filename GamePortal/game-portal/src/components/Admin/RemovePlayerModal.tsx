import * as React from "react";
import { useContext } from "react";
import { Modal, Button, Form, Row, Col, FormText } from "react-bootstrap";
import { Player } from "../../models/player.model";

interface IRemovePlayerModalProps {
  show: boolean;
  close: any;
  player: Player;
  playerChangedListener: () => void;
}

const RemovePlayerModal: React.FunctionComponent<IRemovePlayerModalProps> = ({
  show,
  close,
  player,
  playerChangedListener,
}) => {

  function formatBirthdateString(birthdateString: string) {
    return birthdateString.split('T')[0];
  }

  async function removePlayer() {
    await fetch("http://localhost:5086/api/players", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(player),
    }).then((response) => {
      if (response.status === 200) {
        console.log("Player removed successfully");
      } else {
        console.log("Error");
      }
    });
  };

  return (
    <>
      <Modal show={show} onHide={close} centered>
        <Modal.Header closeButton id="remove-player-header">
          <Modal.Title>Remove user</Modal.Title>
        </Modal.Header>
        <Modal.Body id="player-modal-body">
          <Row>
            <Col>
              <FormText className="mb-3" id="player-modal-attribute">
                <strong>Full Name: </strong> {player.fullName}
              </FormText>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormText className="mb-3" id="player-modal-attribute">
                <strong>Username: </strong> {player.userName}
              </FormText>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormText className="mb-3" id="player-modal-attribute">
                <strong>Email: </strong> {player.email}
              </FormText>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormText id="player-modal-attribute">
                <strong>Date of birth: </strong> {formatBirthdateString(player.birthdate)}
              </FormText>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            id="remove-btn"
            variant="primary"
            onClick={async () => {
              await removePlayer();
              playerChangedListener();
              close(true);
            }}
          >
            Remove
          </Button>
          <Button variant="danger" onClick={close}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default RemovePlayerModal;