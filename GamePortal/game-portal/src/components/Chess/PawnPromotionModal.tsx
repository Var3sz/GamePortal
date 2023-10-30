import { Modal, Container, Form, Image } from "react-bootstrap";

interface PawnPromotionModalProps {
    show: boolean
    onClose: () => void;
  }
  
  const PawnPromotionModal: React.FunctionComponent<PawnPromotionModalProps> = ({ show, onClose }) => {
    return (
      <Modal show={show} onHide={onClose} centered id="pawn-promotion-modal-body">
        <Modal.Body>
          <Container>
            <Form.Text>Congratulations!</Form.Text>
            <Form.Text className="mt-3">You are the winner.</Form.Text>
          </Container>
        </Modal.Body>
      </Modal>
    );
  };

export default PawnPromotionModal;