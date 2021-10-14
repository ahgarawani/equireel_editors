import { Table, Thead, Tbody, Tfoot, Tr, Th, Td } from "@chakra-ui/react";

import { add, bignumber, number } from "mathjs";

import { itemsListReducer } from "../utils";

function MonthTable({ items }) {
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
          >
            Date
          </Th>
          <Th bg="red.500" color="white" fontSize="md" textAlign="center">
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
        {items.map((dayItem) => (
          <Tr key={dayItem.day + dayItem.eventName + dayItem.type}>
            <Td>
              {new Date(dayItem.day).toLocaleDateString("en-us", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </Td>
            <Td>{dayItem.eventName}</Td>
            <Td>{dayItem.type}</Td>
            <Td>{dayItem.noItems}</Td>
            <Td>{itemsListReducer(dayItem.items)}</Td>
            <Td>${dayItem.price}</Td>
          </Tr>
        ))}
      </Tbody>
      <Tfoot>
        <Tr>
          <Th></Th>
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

export default MonthTable;
