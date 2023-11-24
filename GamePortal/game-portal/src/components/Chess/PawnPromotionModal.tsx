import { Modal, ModalOverlay, ModalContent, ModalBody, Image } from "@chakra-ui/react";
import { PieceType } from "../../helpers/chess.helpers/chess.enums";

interface PawnPromotionModalProps {
    isOpen: boolean;
    onClose?: () => void;
    promotePawn: (type: PieceType) => void;
    pawnPromotionColor: () => string;
}

export const PawnPromotionModal: React.FC<PawnPromotionModalProps> = ({ isOpen, onClose = () => { }, promotePawn, pawnPromotionColor }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
            <ModalOverlay />
            <ModalContent height={'200px'} borderRadius={'0px'}>
                <ModalBody
                    display="flex"
                    justifyContent="space-around"
                    alignItems="center"
                    backgroundColor="rgba(0, 0, 0, 0.4)"
                >
                    <Image
                        onClick={() => promotePawn(PieceType.ROOK)}
                        src={`chess-pieces/${pawnPromotionColor()}_rook.png`}
                        height="100px"
                        borderRadius="50%"
                        padding="5px"
                        _hover={{ backgroundColor: 'rgba(255, 255, 255, 0.3)', cursor: 'pointer' }}
                    />
                    <Image
                        onClick={() => promotePawn(PieceType.BISHOP)}
                        src={`chess-pieces/${pawnPromotionColor()}_bishop.png`}
                        height="100px"
                        borderRadius="50%"
                        padding="5px"
                        _hover={{ backgroundColor: 'rgba(255, 255, 255, 0.3)', cursor: 'pointer' }}
                    />
                    <Image
                        onClick={() => promotePawn(PieceType.KNIGHT)}
                        src={`chess-pieces/${pawnPromotionColor()}_knight.png`}
                        height="100px"
                        borderRadius="50%"
                        padding="5px"
                        _hover={{ backgroundColor: 'rgba(255, 255, 255, 0.3)', cursor: 'pointer' }}
                    />
                    <Image
                        onClick={() => promotePawn(PieceType.QUEEN)}
                        src={`chess-pieces/${pawnPromotionColor()}_queen.png`}
                        height="100px"
                        borderRadius="50%"
                        padding="5px"
                        _hover={{ backgroundColor: 'rgba(255, 255, 255, 0.3)', cursor: 'pointer' }}
                    />
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default PawnPromotionModal;