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
    <Table variant="simple" size="md">
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
          <Th color="white" fontSize="md" textAlign="center">
            Type
          </Th>
          <Th color="white" fontSize="md" textAlign="center">
            Item
          </Th>
          <Th
            borderRightRadius={areSomeDone ? "" : "lg"}
            color="white"
            fontSize="md"
            textAlign="center"
          >
            Status
          </Th>
          {areSomeDone && (
            <Th
              borderRightRadius="lg"
              color="white"
              fontSize="md"
              textAlign="center"
            >
              Editor
            </Th>
          )}
        </Tr>
      </Thead>
      <Tbody>
        {searchResults.map((result) => (
          <Tr key={result.id}>
            <Td>{result.eventName}</Td>
            <Td>{result.type}</Td>
            <Td>{result.itemValue}</Td>
            <Td fontWeight="bold" color={result.done ? "green" : "red.500"}>
              {result.done ? "Done" : "Not Done"}
            </Td>
            {areSomeDone && (
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
