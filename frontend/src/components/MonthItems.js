import { useState, useEffect } from "react";

import { useAuthState } from "../contexts";

import { Box, Heading, Spinner } from "@chakra-ui/react";

import MonthTable from "./MonthTable.js";
import MonthCards from "./MonthCards";

function MonthItems({ month }) {
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
      mb={8}
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
        <>
          <Box display={{ base: "none", lg: "inline-block" }} px={4}>
            <MonthTable items={monthItems} />
          </Box>

          <Box display={{ base: "inline-block", lg: "none" }}>
            <MonthCards items={monthItems} />
          </Box>
        </>
      )}
    </>
  );
}

export default MonthItems;
