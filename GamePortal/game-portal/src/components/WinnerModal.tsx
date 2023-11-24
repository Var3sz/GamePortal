import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Image,
  Stack,
  Text,
  Flex,
  HStack,
} from "@chakra-ui/react";
import trophy from '../images/trophy.png';
import { customColors } from "../theme/theme";

interface WinnerModalProps {
  isOpen: boolean;
  winnerName: string;
  onClose: () => void;
  restart: () =>void;
}

const WinnerModal: React.FC<WinnerModalProps> = ({ isOpen, winnerName, onClose, restart }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent borderRadius={'0px'}>
        <ModalHeader backgroundColor={customColors.primary} mb={'0px'}>
          <HStack gap={2}>
            <Text mt={'10px'}>Winner</Text>
            <Image src={trophy} alt="Trophy" boxSize="20px" />
          </HStack>
        </ModalHeader>
        <ModalCloseButton
          colorScheme="blue" // Change this to your desired color
        />
        <ModalBody>
          <Text fontSize="lg" mt={3}>
            Congratulations, <strong>{winnerName}</strong>!
          </Text>
          <Text fontSize="md" mt={3}>
            You are the winner.
          </Text>
        </ModalBody>
        <ModalFooter>
          <HStack gap={3}>
            <Button variant="modalButton" onClick={restart}>
              Restart
            </Button>
            <Button colorScheme="red" onClick={onClose}>
              Close
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default WinnerModal;