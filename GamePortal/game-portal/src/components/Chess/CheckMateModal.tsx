import React from 'react';
import { Button, Modal, ModalBody, ModalContent, ModalOverlay, Heading, HStack } from '@chakra-ui/react';
import { PieceColor } from '../../helpers/chess.helpers/chess.enums';
import { useNavigate } from 'react-router-dom';

interface CheckmateModalProps {
    isOpen: boolean;
    onClose?: () => void;
    winningColor?: PieceColor;
    restartGame: () => void;
}

export const CheckmateModal: React.FC<CheckmateModalProps> = ({ isOpen, winningColor, onClose = () => { }, restartGame }) => {
    const navigate = useNavigate();

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
            <ModalOverlay />
            <ModalContent borderRadius={'0px'}>
                <ModalBody backgroundColor="rgba(0, 0, 0, 0.3)" textAlign="center">
                    <Heading mb={4}>The winner is {winningColor === 'white' ? 'White' : 'Black'}!</Heading>
                    <HStack spacing={4} justifyContent="center">
                        <Button variant="modalButton" onClick={restartGame} width="120px">
                            Rematch
                        </Button>
                        <Button colorScheme="red" onClick={() => navigate('/home')} width="120px">
                            Home
                        </Button>
                    </HStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default CheckmateModal;