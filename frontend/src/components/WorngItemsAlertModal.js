import {
  Text,
  Flex,
  Button,
  Spacer,
  Box,
  Divider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

function ItemsCluster({ items }) {
  return (
    <Flex width="100%" justifyContent="center">
      <Flex
        direction="row"
        width="90%"
        fontWeight="medium"
        p="3"
        border="1px"
        borderColor="gray.400"
        borderRadius="lg"
      >
        <Box
          minW="10"
          maxW="60"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Text>{items.event}</Text>
        </Box>
        <Spacer />
        <Divider orientation="vertical" />
        <Spacer />
        <Box
          minW="10"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Text>{items.type}</Text>
        </Box>
        <Spacer />
        <Divider orientation="vertical" />
        <Spacer />
        <Box
          minW="10"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Text>{items.number}</Text>
        </Box>
        <Spacer />
        <Divider orientation="vertical" />
        <Spacer />
        <Box
          minW="10"
          maxW="80"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Text>{items.items}</Text>
        </Box>
      </Flex>
    </Flex>
  );
}

function WorngItemsAlertModal({
  nonExistentItems,
  setNonExistentItems,
  duplicateItems,
  setDuplicateItems,
  modalControls,
}) {
  const closeModal = () => {
    setNonExistentItems({
      event: "",
      type: "",
      number: 0,
      items: "",
    });
    setDuplicateItems({
      event: "",
      type: "",
      number: 0,
      items: "",
    });
    modalControls.onClose();
  };
  return (
    <>
      <Modal isOpen={modalControls.isOpen} onClose={closeModal} size="4xl">
        <ModalOverlay />
        <ModalContent scrollBehavior="inside">
          <ModalHeader>Not All Items Were Marked as Done</ModalHeader>
          <ModalCloseButton />
          <Divider borderColor="gray.400" />
          <ModalBody>
            {nonExistentItems.items.length > 0 && (
              <>
                <Text p="5" color="red.500" fontWeight="medium" fontSize="lg">
                  These items weren't marked as done because they are not in the
                  database. Please review them and try again!
                </Text>
                <ItemsCluster items={nonExistentItems} />
              </>
            )}

            {duplicateItems.items.length > 0 && (
              <>
                <Text p="5" color="red.500" fontWeight="medium" fontSize="lg">
                  These items weren't marked as done because they are already
                  done. Please review them and try again!
                </Text>
                <ItemsCluster items={duplicateItems} />
              </>
            )}

            <Text pt="5" px="5" fontWeight="medium" fontSize="lg">
              If you're sure they're correct, notify an admin.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={closeModal}>
              Close
            </Button>
            {/* <Button variant="ghost">Notify an admin</Button> */}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default WorngItemsAlertModal;
