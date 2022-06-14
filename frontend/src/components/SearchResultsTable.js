import { useState, useEffect } from "react";

import {
  Heading,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";

import { useAuthState } from "../contexts";
import ItemPriceGroup from "./ItemPriceGroup";

function SearchResultsTable({ searchResults }) {
  const [areSomeDone, setAreSomeDone] = useState(false);

  const currentUser = useAuthState();

  useEffect(() => {
    for (const result of searchResults) {
      if (result.done) {
        setAreSomeDone(true);
        break;
      }
    }
  }, [searchResults]);

  return (
    <Table variant="simple" size="md" width="100%">
      <Thead>
        <Tr bg="red.500">
          <Th
            borderLeftRadius="lg"
            color="white"
            fontSize="md"
            textAlign="center"
          >
            Event Name
          </Th>
          <Th color="white" fontSize="md" textAlign="center" width="10%">
            Type
          </Th>
          <Th color="white" fontSize="md" textAlign="center" width="10%">
            Item
          </Th>
          <Th
            borderRightRadius={areSomeDone ? "" : "lg"}
            color="white"
            fontSize="md"
            textAlign="center"
            width="13%"
          >
            Status
          </Th>
          {areSomeDone && (
            <>
              <Th color="white" fontSize="md" textAlign="center" width="10%">
                Editor
              </Th>
              <Th
                borderRightRadius="lg"
                color="white"
                fontSize="md"
                textAlign="center"
                width="21%"
              >
                Price
              </Th>
            </>
          )}
        </Tr>
      </Thead>
      <Tbody>
        {searchResults.map((result) => (
          <Tr key={result.id}>
            <Td>{result.eventName}</Td>
            <Td textAlign="center">{result.type}</Td>
            <Td textAlign="center">{result.itemValue}</Td>
            <Td fontWeight="bold" color={result.done ? "green" : "red.500"}>
              {result.done ? "Done" : "Not Done"}
            </Td>
            {areSomeDone && (
              <>
                <Td
                  fontWeight="bold"
                  color={
                    result.editor === currentUser.userDetails.name
                      ? "green"
                      : "gray.700"
                  }
                >
                  {result.editor}
                </Td>
                <Td>
                  {result.price > -1 && (
                    <ItemPriceGroup
                      itemId={result.id}
                      itemPrice={result.price}
                      itemType={result.type}
                      itemWeek={result.itemWeek}
                    />
                  )}
                </Td>
              </>
            )}
          </Tr>
        ))}
      </Tbody>
      <Tfoot>
        <Tr>
          <Th></Th>
          <Th></Th>
          <Th>
            <Heading pt="2" size="sm">
              end of results
            </Heading>
          </Th>
          <Th></Th>
          <Th></Th>
        </Tr>
      </Tfoot>
    </Table>
  );
}

export default SearchResultsTable;
