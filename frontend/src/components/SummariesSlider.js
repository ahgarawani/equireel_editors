import { useState } from "react";
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
import MonthItems from "./MonthItems.js";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

import { useAuthState } from "../contexts";

function SummariesSlider({ editor }) {
  const currentUser = useAuthState();
  const now = new Date();
  const startedAt = new Date(
    editor ? editor.startedAt : currentUser.userDetails.startedAt
  );
  const monthLimits = {
    lower: { month: startedAt.getMonth(), year: startedAt.getFullYear() },
    upper: { month: now.getMonth(), year: now.getFullYear() },
  };

  const [displayedMonth, setDisplayedMonth] = useState({
    month: monthLimits.upper.month,
    year: monthLimits.upper.year,
  });

  const { isOpen, onToggle } = useDisclosure();

  const responsiveSize = useBreakpointValue({ base: "sm", md: "md" });

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
    <Flex width="100%" direction="column" align="center">
      <Flex width="100%" p="4" align="center">
        <Box
          display={{
            base: isOpen ? "none" : "inline-block",
            lg: "inline-block",
          }}
        >
          <Heading size="md" p="2">
            {editor ? editor.name : "Monthly Summary"}
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
              {JSON.stringify(monthLimits.lower) !==
                JSON.stringify(displayedMonth) && (
                <IconButton
                  icon={<IoIosArrowBack />}
                  borderRadius="full"
                  size={responsiveSize}
                  colorScheme="red"
                  variant="ghost"
                  onClick={() => slideMonth(-1)}
                />
              )}
              <Heading size={responsiveSize}>
                {formatDate(displayedMonth)}
              </Heading>
              {JSON.stringify(monthLimits.upper) !==
                JSON.stringify(displayedMonth) && (
                <IconButton
                  icon={<IoIosArrowForward />}
                  borderRadius="full"
                  size={responsiveSize}
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
      <Collapse in={isOpen} animateOpacity width="100%">
        {isOpen && (
          <MonthItems
            month={formatDate(displayedMonth)}
            editorId={editor ? editor.id : undefined}
          />
        )}
      </Collapse>
    </Flex>
  );
}

export default SummariesSlider;
