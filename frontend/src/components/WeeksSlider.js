import { useEffect, useRef, useState } from "react";
import {
  Box,
  HStack,
  Flex,
  Spacer,
  Button,
  IconButton,
  Heading,
  Collapse,
  useDisclosure,
  useBreakpointValue,
} from "@chakra-ui/react";
import WeekItems from "./WeekItems.js";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

import { useAuthState } from "../contexts";

function WeeksSlider() {
  const ROOT_URL = process.env.REACT_APP_API_HOST_URL;
  const currentUser = useAuthState();

  const currentWeek = useRef(0);
  const [displayedWeek, setDisplayedWeek] = useState(0);

  useEffect(() => {
    async function fetchWeek() {
      try {
        let res = await fetch(`${ROOT_URL}/configs/week`, {
          headers: {
            Authorization: "Bearer " + currentUser.token,
          },
        });
        if (res.status !== 200) {
          throw new Error("Failed to fetch week.");
        }
        let resData = await res.json();
        currentWeek.current = resData.week;
        setDisplayedWeek(resData.week);
      } catch (err) {
        console.log(err);
      }
    }
    fetchWeek();
  }, [ROOT_URL, currentUser]);

  const { isOpen, onToggle } = useDisclosure();

  const responsiveSize = useBreakpointValue({ base: "sm", md: "md" });

  return (
    <Flex width="100%" direction="column" align="center" justify="100%">
      <Flex width="100%" p="4" align="center">
        <Box
          display={{
            base: isOpen ? "none" : "inline-block",
            lg: "inline-block",
          }}
        >
          <Heading size="md" p="2">
            Weekly Summary
          </Heading>
        </Box>
        <Spacer
          display={{
            base: isOpen ? "none" : "inline-block",
            md: "inline-block",
          }}
        />
        <Box>
          {isOpen && (
            <HStack>
              {displayedWeek !== 1 && (
                <IconButton
                  icon={<IoIosArrowBack />}
                  borderRadius="full"
                  size={responsiveSize}
                  colorScheme="red"
                  variant="ghost"
                  onClick={() => setDisplayedWeek(displayedWeek - 1)}
                />
              )}
              <Heading size={responsiveSize}>{`Week ${displayedWeek}`}</Heading>
              {displayedWeek !== currentWeek.current && (
                <IconButton
                  icon={<IoIosArrowForward />}
                  borderRadius="full"
                  size={responsiveSize}
                  colorScheme="red"
                  variant="ghost"
                  onClick={() => setDisplayedWeek(displayedWeek + 1)}
                />
              )}
            </HStack>
          )}
        </Box>
        <Spacer />
        <Box>
          <Button onClick={onToggle} colorScheme={isOpen ? "gray" : "red"}>
            {isOpen ? "Hide" : "Show"}
          </Button>
        </Box>
      </Flex>
      <Collapse in={isOpen} animateOpacity width="100%">
        {isOpen && <WeekItems week={displayedWeek} />}
      </Collapse>
    </Flex>
  );
}

export default WeeksSlider;
