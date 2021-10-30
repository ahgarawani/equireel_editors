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
} from "@chakra-ui/react";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { itemsListReducer } from "../utils";

export default function RuleItem({
  rule: { id, title, events, itemType, itemPrice, timeRange },
}) {
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
              {!isFinite(timeRange[1])
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
                    {events
                      .sort((a, b) =>
                        a.name > b.name ? 1 : b.name > a.name ? -1 : 0
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
