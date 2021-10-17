import { useState, useEffect } from "react";

import { useAuthState } from "../contexts";

import { Box, Heading, Spinner } from "@chakra-ui/react";

import WeekTable from "./WeekTable.js";
import WeekCards from "./WeekCards";

function WeekItems({ week }) {
  const ROOT_URL = process.env.REACT_APP_API_HOST_URL;

  const [weekItems, setWeekItems] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const currentUser = useAuthState();

  useEffect(() => {
    async function fetchWeekItems(week) {
      let url = new URL(`${ROOT_URL}/items/itemsByWeek`),
        params = { week };
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
        setWeekItems(resData.items);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    }
    setIsLoading(true);
    fetchWeekItems(week);
  }, [ROOT_URL, week, currentUser]);
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
      {weekItems.length === 0 ? (
        <Heading size="lg" py="5">
          Nothing to show yet!
        </Heading>
      ) : (
        <>
          <Box display={{ base: "none", lg: "inline-block" }} px={4}>
            <WeekTable items={weekItems} />
          </Box>

          <Box display={{ base: "inline-block", lg: "none" }}>
            <WeekCards items={weekItems} />
          </Box>
        </>
      )}
    </>
  );
}

export default WeekItems;
