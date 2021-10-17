import { Table, Thead, Tbody, Tfoot, Tr, Th, Td } from "@chakra-ui/react";

import { add, bignumber, number } from "mathjs";

import { itemsListReducer } from "../utils";

function WeekTable({ items }) {
  return (
    <Table variant="simple" size="md">
      <Thead>
        <Tr>
          <Th
            bg="red.500"
            color="white"
            fontSize="md"
            textAlign="center"
            borderLeftRadius="md"
            width="30%"
          >
            Event Name
          </Th>
          <Th bg="red.500" color="white" fontSize="md" textAlign="center">
            Type
          </Th>
          <Th bg="red.500" color="white" fontSize="md" textAlign="center">
            No.
          </Th>
          <Th bg="red.500" color="white" fontSize="md" textAlign="center">
            Items
          </Th>
          <Th
            bg="red.500"
            color="white"
            fontSize="md"
            textAlign="center"
            borderRightRadius="md"
          >
            Price
          </Th>
        </Tr>
      </Thead>
      <Tbody>
        {items.map((eventItem) => (
          <Tr key={eventItem.eventName + eventItem.type}>
            <Td>{eventItem.eventName}</Td>
            <Td>{eventItem.type}</Td>
            <Td>{eventItem.noItems}</Td>
            <Td>{itemsListReducer(eventItem.items)}</Td>
            <Td>${eventItem.price}</Td>
          </Tr>
        ))}
      </Tbody>
      <Tfoot>
        <Tr>
          <Th></Th>
          <Th></Th>
          <Th></Th>
          <Th isNumeric="true" fontSize="lg">
            Total:
          </Th>
          <Th fontSize="lg">
            $
            {items.reduce(
              (acc, curr) => number(add(bignumber(acc), bignumber(curr.price))),
              bignumber(0)
            )}
          </Th>
        </Tr>
      </Tfoot>
    </Table>
  );
}

export default WeekTable;
