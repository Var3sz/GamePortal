import React from 'react';
import { Button, Modal, ModalBody, ModalContent, ModalOverlay, Heading } from '@chakra-ui/react';
import { PieceColor } from '../../helpers/chess.helpers/chess.enums';

interface CheckmateModalProps {
    isOpen: boolean;
    onClose?: () => void;
    winningColor?: PieceColor;
    restartGame: () => void;
}

export const CheckmateModal: React.FC<CheckmateModalProps> = ({ isOpen, winningColor, onClose = () => { }, restartGame }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
            <ModalOverlay />
            <ModalContent borderRadius={'0px'}>
                <ModalBody backgroundColor="rgba(0, 0, 0, 0.3)" textAlign="center">
                    <Heading mb={4}>The winner is {winningColor === 'white' ? 'White' : 'Black'}!</Heading>
                    <Button variant="modalButton" justifyContent="center" onClick={restartGame} mx="auto" display="block">
                        Rematch
                    </Button>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default CheckmateModal;