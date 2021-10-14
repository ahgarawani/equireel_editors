import { Flex, SimpleGrid, Divider, Heading, Text } from "@chakra-ui/react";

import { add, bignumber, number } from "mathjs";

import { itemsListReducer } from "../utils";

function MonthCards({ items }) {
  return (
    <Flex width="100%" direction="column">
      <Divider width="100%" borderWidth="1px" borderColor="gray.300" />
      {items.map((dayItem) => (
        <Flex
          key={dayItem.day + dayItem.eventName + dayItem.type}
          direction="column"
          align="center"
          width="100%"
        >
          <Heading size="sm" mt={5}>
            {new Date(dayItem.day).toLocaleDateString("en-us", {
              weekday: "long",
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </Heading>
          <SimpleGrid
            width="100%"
            gridTemplateColumns={"70px auto"}
            spacing={4}
            p={{ base: 6, md: 10 }}
          >
            <Text fontSize="sm" fontWeight="bold">
              Event
            </Text>
            <Text fontSize="sm">{dayItem.eventName}</Text>
            <Text fontSize="sm" fontWeight="bold">
              Type
            </Text>
            <Text fontSize="sm">{dayItem.type}</Text>
            <Text fontSize="sm" fontWeight="bold">
              Count
            </Text>
            <Text fontSize="sm">{dayItem.noItems}</Text>
            <Text fontSize="sm" fontWeight="bold">
              Items
            </Text>
            <Text fontSize="sm" textAlign="justify">
              {itemsListReducer(dayItem.items)}
            </Text>
            <Text fontSize="sm" fontWeight="bold">
              Price
            </Text>
            <Text fontSize="sm">${dayItem.price}</Text>
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
