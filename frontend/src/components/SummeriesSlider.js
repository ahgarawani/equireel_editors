import { useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Flex,
  Spacer,
  Button,
  IconButton,
  Heading,
  Collapse,
  useDisclosure,
} from "@chakra-ui/react";
import MonthTable from "./MonthTable.js";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

import { useAuthState } from "../contexts";

function SummeriesSlider() {
  const currentUser = useAuthState();
  const now = new Date();
  const startedAt = new Date(currentUser.userDetails.startedAt);
  const monthLimits = {
    lower: { month: startedAt.getMonth(), year: startedAt.getFullYear() },
    upper: { month: now.getMonth(), year: now.getFullYear() },
  };

  const [displayedMonth, setDisplayedMonth] = useState({
    month: monthLimits.upper.month,
    year: monthLimits.upper.year,
  });

  const { isOpen, onToggle } = useDisclosure();

  const formatDate = (date) => {
    const longMonths = {
      0: "January",
      1: "February",
      2: "March",
      3: "April",
      4: "May",
      5: "June",
      6: "July",
      7: "August",
      8: "September",
      9: "October",
      10: "November",
      11: "December",
    };
    return longMonths[date.month] + " " + date.year;
  };

  const slideMonth = (offset) => {
    let newDisplayedMonth = displayedMonth;
    if (displayedMonth.month === 0 && offset === -1) {
      newDisplayedMonth = { month: 11, year: newDisplayedMonth.year - 1 };
    } else if (displayedMonth.month === 11 && offset === 1) {
      newDisplayedMonth = { month: 0, year: newDisplayedMonth.year + 1 };
    } else {
      newDisplayedMonth = {
        ...displayedMonth,
        month: displayedMonth.month + offset,
      };
    }
    setDisplayedMonth(newDisplayedMonth);
  };

  return (
    <Box width="100%" pb="5" px={100}>
      <VStack
        width="100%"
        borderColor="gray.200"
        boxShadow="sm"
        borderWidth="2px"
        borderRadius="xl"
        p="4"
        bg="white"
      >
        <Flex width="100%" pb={isOpen ? "2" : ""}>
          <Box>
            <Heading size="md" p="2">
              Monthly Summery
            </Heading>
          </Box>
          <Spacer />
          <Box>
            {isOpen && (
              <HStack>
                {JSON.stringify(monthLimits.lower) !==
                  JSON.stringify(displayedMonth) && (
                  <IconButton
                    icon={<IoIosArrowBack />}
                    borderRadius="full"
                    size="lg"
                    colorScheme="red"
                    variant="ghost"
                    onClick={() => slideMonth(-1)}
                  />
                )}
                <Heading size="md">{formatDate(displayedMonth)}</Heading>
                {JSON.stringify(monthLimits.upper) !==
                  JSON.stringify(displayedMonth) && (
                  <IconButton
                    icon={<IoIosArrowForward />}
                    borderRadius="full"
                    size="lg"
                    colorScheme="red"
                    variant="ghost"
                    onClick={() => slideMonth(1)}
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
        <Collapse in={isOpen} animateOpacity>
          {isOpen && <MonthTable month={formatDate(displayedMonth)} />}
        </Collapse>
      </VStack>
    </Box>
  );
}

export default SummeriesSlider;
