import { Flex } from "@chakra-ui/react";
import WeeksSlider from "../components/WeeksSlider";

export default function InvoicesAdmin() {
  return (
    <Flex width="100%" justify="center" align="center" direction="column">
      <Flex
        width="90%"
        mb={{ base: 5, md: 10 }}
        borderColor="gray.200"
        boxShadow="sm"
        borderWidth="2px"
        borderRadius="xl"
        justify="center"
        align="center"
        bg="white"
      >
        <WeeksSlider />
      </Flex>
    </Flex>
  );
}
