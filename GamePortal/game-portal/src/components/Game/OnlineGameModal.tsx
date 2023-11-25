import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Heading, Text } from '@chakra-ui/react'

interface OnlineGameModalprops {
    isOpen: boolean;
    welcomeMessage?: string;
    onStartNewGame: () => void;
    onLoadGame: () => void;
}


const OnlineGameModal: React.FC<OnlineGameModalprops> = ({ isOpen, welcomeMessage, onStartNewGame, onLoadGame }) => {
    return (
        <Modal isOpen={isOpen} size={'xl'} onClose={() => { }} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <Heading textAlign={'center'}>
                        {welcomeMessage}
                    </Heading>
                </ModalHeader>
                <ModalBody>
                    <Text>Please choose an option:</Text>
                </ModalBody>
                <ModalFooter>
                    <Button variant={'modalButton'} mr={3} onClick={onStartNewGame}>
                        New game
                    </Button>
                    <Button variant={'modalButton'} onClick={onLoadGame}>
                        Load game
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default OnlineGameModal;