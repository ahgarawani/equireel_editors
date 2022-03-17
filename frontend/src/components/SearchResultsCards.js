import { Flex, Divider, SimpleGrid, Text } from "@chakra-ui/react";

import { useAuthState } from "../contexts";

import ItemPriceGroup from "./ItemPriceGroup";

function MonthCards({ searchResults }) {
  const currentUser = useAuthState();
  return (
    <Flex width="100%" direction="column">
      {searchResults.map((result) => (
        <Flex
          key={result.id}
          direction="column"
          align="center"
          pb={{ base: 5, md: 10 }}
          width="100%"
        >
          <SimpleGrid
            width="100%"
            gridTemplateColumns={"70px auto"}
            spacing={4}
            p={{ base: 5, md: 10 }}
          >
            <Text fontSize="sm" fontWeight="bold">
              Event
            </Text>
            <Text fontSize="sm">{result.eventName}</Text>
            <Text fontSize="sm" fontWeight="bold">
              Type
            </Text>
            <Text fontSize="sm">{result.type}</Text>
            <Text fontSize="sm" fontWeight="bold">
              Item
            </Text>
            <Text fontSize="sm">{result.itemValue}</Text>
            <Text fontSize="sm" fontWeight="bold">
              Status
            </Text>
            <Text
              fontSize="sm"
              fontWeight="bold"
              color={result.done ? "green" : "red.500"}
            >
              {result.done ? "Done" : "Not Done"}
            </Text>
            {result.editor !== "" && (
              <Text fontSize="sm" fontWeight="bold">
                Editor
              </Text>
            )}
            <Text
              fontSize="sm"
              fontWeight="bold"
              color={
                result.editor === currentUser.userDetails.name
                  ? "green"
                  : "gray.700"
              }
            >
              {result.editor}
            </Text>
            {result.price > -1 && (
              <>
                <Text fontSize="sm" fontWeight="bold">
                  Price
                </Text>
                <ItemPriceGroup
                  itemId={result.id}
                  itemPrice={result.price}
                  itemType={result.type}
                />
              </>
            )}
          </SimpleGrid>
          <Divider width="100%" borderWidth="1px" borderColor="gray.300" />
        </Flex>
      ))}
      <Flex justify="center" align="center">
        <Text fontWeight="bold" fontSize="lg">
          END OF RESULTS
        </Text>
      </Flex>
    </Flex>
  );
}

export default MonthCards;
