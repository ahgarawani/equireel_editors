import { Flex, SimpleGrid, Divider, Heading, Text } from "@chakra-ui/react";

import { add, bignumber, number } from "mathjs";

import { itemsListReducer } from "../utils";

function MonthCards({ items }) {
  return (
    <Flex width="100%" direction="column">
      <Divider width="100%" borderWidth="1px" borderColor="gray.300" />
      {items.map((eventItem) => (
        <Flex
          key={eventItem.eventName + eventItem.type}
          direction="column"
          align="center"
          width="100%"
        >
          <Heading size="sm" mt={5} px={5} textAlign="center">
            {eventItem.eventName}
          </Heading>
          <SimpleGrid
            width="100%"
            gridTemplateColumns={"70px auto"}
            spacing={4}
            p={{ base: 6, md: 10 }}
          >
            <Text fontSize="sm" fontWeight="bold">
              Type
            </Text>
            <Text fontSize="sm">{eventItem.type}</Text>
            <Text fontSize="sm" fontWeight="bold">
              Count
            </Text>
            <Text fontSize="sm">{eventItem.noItems}</Text>
            <Text fontSize="sm" fontWeight="bold">
              Items
            </Text>
            <Text fontSize="sm" textAlign="justify">
              {itemsListReducer(eventItem.items)}
            </Text>
            <Text fontSize="sm" fontWeight="bold">
              Price
            </Text>
            <Text fontSize="sm">${eventItem.price}</Text>
          </SimpleGrid>
          <Divider width="100%" borderWidth="1px" borderColor="gray.300" />
        </Flex>
      ))}
      <Flex width="100%" justify="space-between" p={5}>
        <Text fontSize="lg" fontWeight="black">
          Total:
        </Text>
        <Text fontSize="lg" fontWeight="bold">
          $
          {items.reduce(
            (acc, curr) => number(add(bignumber(acc), bignumber(curr.price))),
            bignumber(0)
          )}
        </Text>
      </Flex>
    </Flex>
  );
}

export default MonthCards;
