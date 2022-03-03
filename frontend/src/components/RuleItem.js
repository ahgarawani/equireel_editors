import { useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Flex,
  Box,
  SimpleGrid,
  Text,
  UnorderedList,
  ListItem,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { itemsListReducer } from "../utils";
import { useAuthState } from "../contexts";

export default function RuleItem({
  rule: { id, title, events, itemType, itemPrice, timeRange },
}) {
  console.log(timeRange[1]);
  const ROOT_URL = process.env.REACT_APP_API_HOST_URL;
  const [displayedEvents, setDisplayedEvents] = useState(events);
  const currentUser = useAuthState();
  const toast = useToast();

  const handleEventDelete = async (rule, event) => {
    try {
      const res = await fetch(`${ROOT_URL}/rules/removeEvent`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + currentUser.token,
        },
        body: JSON.stringify({
          rule,
          event,
        }),
      });
      const resData = await res.json();
      if (res.status === 201) {
        toast({
          title: "Removing an Event from a Rule",
          description: resData.message,
          status: "success",
          duration: 6000,
          isClosable: true,
        });
        setDisplayedEvents(
          displayedEvents.filter((arrEvent) => arrEvent.id !== event)
        );
      } else {
        toast({
          title: "Removing an Event from a Rule",
          description: resData.message,
          status: "error",
          duration: 10000,
          isClosable: true,
        });
        return;
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <AccordionItem>
      <AccordionButton>
        <Box flex="1" textAlign="left">
          <Text fontSize="lg" fontWeight="semibold">
            {title}
          </Text>
        </Box>

        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel>
        <Flex direction="column" align="center" width="100%">
          <SimpleGrid
            width="100%"
            gridTemplateColumns={"auto auto"}
            spacing={4}
            px={{ base: 6, md: 10 }}
            pb={3}
          >
            <Text fontSize="md" fontWeight="bold">
              Item Type
            </Text>
            <Text fontSize="md">{itemsListReducer(itemType)}</Text>
            <Text fontSize="md" fontWeight="bold">
              Item Price
            </Text>
            <Text fontSize="md">${itemPrice}</Text>
            <Text fontSize="md" fontWeight="bold">
              Time Range
            </Text>
            <Text fontSize="md">
              {timeRange[1] !== null
                ? `${Math.floor((timeRange[1] - timeRange[0]) / 60)} Hours.`
                : "Indefinite."}
            </Text>
          </SimpleGrid>
          <Box width="100%" px={{ base: 2, md: 6 }}>
            <Accordion allowToggle>
              <AccordionItem>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <Text fontSize="md" fontWeight="bold">
                      Events
                    </Text>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel>
                  <UnorderedList>
                    {displayedEvents
                      .sort(
                        (a, b) =>
                          b.name.localeCompare(a.name) && a.season - b.season
                      )
                      .map((event) => (
                        <Flex
                          key={event.id}
                          borderRadius="xl"
                          p={2}
                          justify="space-between"
                          align="center"
                          _hover={{ bgColor: "gray.50" }}
                        >
                          <ListItem fontWeight="semibold">
                            {event.name}.
                          </ListItem>
                          <IconButton
                            variant="ghost"
                            size="md"
                            borderRadius="xl"
                            icon={<RiDeleteBin5Fill />}
                            onClick={(e) => {
                              e.preventDefault();
                              handleEventDelete(id, event.id);
                            }}
                          />
                        </Flex>
                      ))}
                  </UnorderedList>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Box>
        </Flex>
      </AccordionPanel>
    </AccordionItem>
  );
}
