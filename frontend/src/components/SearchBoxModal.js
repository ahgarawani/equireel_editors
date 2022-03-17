import { useState } from "react";

import {
  Heading,
  Flex,
  VStack,
  Button,
  Spinner,
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
import SearchForm from "./SearchForm";
import SearchResultsTable from "./SearchResultsTable";
import SearchResultsCards from "./SearchResultsCards";

function SearchBoxModal({ modalControls: { isOpen, onClose } }) {
  const ROOT_URL = process.env.REACT_APP_API_HOST_URL;
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchForItems = async (query, currentUser) => {
    let url = new URL(`${ROOT_URL}/items/search`),
      params = {
        eventStr: query.event,
        type: query.type,
        itemsStr: query.itemsStr,
      };
    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, params[key])
    );
    try {
      setIsLoading(true);
      let res = await fetch(url, {
        headers: {
          Authorization: "Bearer " + currentUser.token,
        },
      });
      if (res.status !== 200) {
        throw new Error("Failed to search.");
      }
      let resData = await res.json();
      setSearchResults(resData.results);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const clearModal = () => {
    setIsLoading(false);
    setSearchResults([]);
  };

  const closeModal = () => {
    onClose();
    clearModal();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      size="6xl"
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent bg="#fafafa">
        <ModalHeader bg="white">Search For Items!</ModalHeader>
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
              <Box width="100%" p="4">
                <SearchForm
                  searchFunc={searchForItems}
                  clearSearch={clearModal}
                />
              </Box>

              <Divider width="100%" borderColor="gray.200" />
              {isLoading ? (
                <Spinner
                  p="5"
                  thickness="8px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="red.500"
                  size="md"
                />
              ) : (
                <Box width="100%" pb={5}>
                  {searchResults.length === 0 ? (
                    <Heading p={5} size="md">
                      Nothing to show!
                    </Heading>
                  ) : (
                    <>
                      <Box
                        width="100%"
                        p={4}
                        display={{ base: "none", lg: "inline-block" }}
                      >
                        <SearchResultsTable searchResults={searchResults} />
                      </Box>
                      <Box
                        width="100%"
                        display={{ base: "inline-block", lg: "none" }}
                      >
                        <SearchResultsCards searchResults={searchResults} />
                      </Box>
                    </>
                  )}
                </Box>
              )}
            </VStack>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="red" onClick={closeModal}>
            Done
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default SearchBoxModal;
