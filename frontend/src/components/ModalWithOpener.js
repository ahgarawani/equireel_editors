import React from "react";
import {
  Flex,
  VStack,
  Box,
  Button,
  Divider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";

export default function ModalWithOpener({
  children,
  modalOpener: ModalOpener,
  modalHeader,
  ...rest
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {React.cloneElement(ModalOpener, { onClick: onOpen })}
      <Modal isOpen={isOpen} onClose={onClose} {...rest}>
        <ModalOverlay />
        <ModalContent bg="#fafafa">
          <ModalHeader bg="white">{modalHeader}</ModalHeader>
          <ModalCloseButton />
          <Divider borderColor="gray.200" />
          <ModalBody>
            <Flex width="100%" justify="center" pt="3%" pb="2%">
              <VStack
                width="95%"
                bg="white"
                borderColor="gray.200"
                borderWidth="2px"
                borderRadius="xl"
                boxShadow="sm"
              >
                <Box width="100%">{children}</Box>
              </VStack>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" onClick={onClose}>
              Done
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
