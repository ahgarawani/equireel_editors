import { useState, useEffect } from "react";

import { useAuthState } from "../contexts";

import { Box, Heading, Spinner, Accordion } from "@chakra-ui/react";

import RuleItem from "./RuleItem";

function RulesItems() {
  const ROOT_URL = process.env.REACT_APP_API_HOST_URL;

  const [rules, setRules] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const currentUser = useAuthState();

  useEffect(() => {
    async function fetchRules() {
      try {
        const res = await fetch(`${ROOT_URL}/rules`, {
          headers: {
            Authorization: "Bearer " + currentUser.token,
          },
        });
        if (res.status !== 200) {
          throw new Error("Failed to fetch rules.");
        }
        let resData = await res.json();
        setRules(resData.rules);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    }
    setIsLoading(true);
    fetchRules();
  }, [ROOT_URL, currentUser]);
  return isLoading ? (
    <Spinner
      p="50"
      m={8}
      thickness="10px"
      speed="0.65s"
      emptyColor="gray.200"
      color="red.500"
      size="2xl"
    />
  ) : (
    <>
      {rules.length === 0 ? (
        <Heading size="lg" py="5">
          Nothing to show yet!
        </Heading>
      ) : (
        <>
          {/* <Box display={{ base: "none", lg: "inline-block" }} px={4}>
            <RulesTable rules={rules} />
          </Box> */}

          <Box width="100%">
            <Accordion allowToggle>
              {rules.map((rule) => (
                <RuleItem key={rule.id} rule={rule} />
              ))}
            </Accordion>
          </Box>
        </>
      )}
    </>
  );
}

export default RulesItems;
