import * as React from "react";
import {
  Button, Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalCloseButton, ModalBody, ModalFooter, Text, HStack,
  Flex, Box
} from "@chakra-ui/react";
import { Player } from "../../models/player.model";
import { customColors } from "../../theme/theme";
import axios from "../../api/axios";

/**
 * 2022-23 Őszi félév
 * Témalaborból merítve, átdolgozva
 */

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

  const removePlayer = async () => {
    try {
      const response = await axios.post("/api/players", JSON.stringify(player), {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      });

      if (response.status === 200) {
        console.log("Player removed successfully");
      }
    } catch (error: any) {
      console.error("Player has not been removed!");
    }
  }

  return (
    <Modal isOpen={show} onClose={close} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent borderRadius={'0px'}>
        <ModalHeader color={customColors.secondary} backgroundColor={customColors.primary}>Remove user</ModalHeader>
        <ModalCloseButton border={"transparent"} backgroundColor={"transparent"} />
        <ModalBody>
          <Flex direction="column">
            <Box fontSize={'20px'}>
              <Text as="b" display="inline-block" marginRight="2">Fullname: </Text>
              <Text display="inline-block">{player.fullName}</Text>
            </Box>
            <Box fontSize={'20px'}>
              <Text as="b" display="inline-block" marginRight="2">Username: </Text>
              <Text display="inline-block">{player.userName}</Text>
            </Box>
            <Box fontSize={'20px'}>
              <Text as="b" display="inline-block" marginRight="2">Email: </Text>
              <Text display="inline-block">{player.email}</Text>
            </Box>
            <Box fontSize={'20px'}>
              <Text as="b" display="inline-block" marginRight="2">Date of birth: </Text>
              <Text display="inline-block">{formatBirthdateString(player.birthdate)}</Text>
            </Box>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <HStack gap={4}>
            <Button
              variant="modalButton"
              onClick={async () => {
                await removePlayer();
                playerChangedListener();
                close(true);
              }}
            >
              Remove
            </Button>
            <Button colorScheme="red" onClick={close}>
              Close
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal >
  );
};


export default RemovePlayerModal;