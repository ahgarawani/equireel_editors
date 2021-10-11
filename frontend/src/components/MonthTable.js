import { useState, useEffect } from "react";

import { useAuthState } from "../contexts";

import {
  Heading,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  Spinner,
} from "@chakra-ui/react";

import { add, bignumber, number } from "mathjs";

import { itemsListReducer } from "../utils";

function MonthTable({ month }) {
  const ROOT_URL = process.env.REACT_APP_API_HOST_URL;

  const [monthItems, setMonthItems] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const currentUser = useAuthState();

  useEffect(() => {
    async function fetchMonthItems(monthStr, userId) {
      let url = new URL(`${ROOT_URL}/items/itemsByMonth`),
        params = { month: monthStr, userId: userId };
      Object.keys(params).forEach((key) =>
        url.searchParams.append(key, params[key])
      );
      try {
        const res = await fetch(url, {
          headers: {
            Authorization: "Bearer " + currentUser.token,
          },
        });
        if (res.status !== 200) {
          throw new Error("Failed to fetch items.");
        }
        let resData = await res.json();
        setMonthItems(resData.items);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    }
    setIsLoading(true);
    fetchMonthItems(month, currentUser.userDetails.id);
  }, [ROOT_URL, month, currentUser]);
  return isLoading ? (
    <Spinner
      p="50"
      thickness="10px"
      speed="0.65s"
      emptyColor="gray.200"
      color="red.500"
      size="2xl"
    />
  ) : (
    <>
      {monthItems.length === 0 ? (
        <Heading size="lg" py="5">
          Nothing to show yet!
        </Heading>
      ) : (
        <Table variant="simple" size="md">
          <Thead>
            <Tr>
              <Th
                bg="red.500"
                color="white"
                fontSize="md"
                textAlign="center"
                borderLeftRadius="md"
                minW="12vw"
              >
                Date
              </Th>
              <Th
                bg="red.500"
                color="white"
                fontSize="md"
                textAlign="center"
                minW="25vw"
              >
                Event Name
              </Th>
              <Th
                bg="red.500"
                color="white"
                fontSize="md"
                textAlign="center"
                maxW="6vw"
              >
                Type
              </Th>
              <Th
                bg="red.500"
                color="white"
                fontSize="md"
                textAlign="center"
                maxW="6vw"
              >
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
                maxW="8vw"
              >
                Price
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {monthItems.map((dayItem) => (
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
                {monthItems.reduce(
                  (acc, curr) =>
                    number(add(bignumber(acc), bignumber(curr.price))),
                  bignumber(0)
                )}
              </Th>
            </Tr>
          </Tfoot>
        </Table>
      )}
    </>
  );
}

export default MonthTable;
