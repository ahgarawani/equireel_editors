import { VStack, Flex, Box } from "@chakra-ui/react";
import TopSec from "../components/TopSec.js";
import AddItem from "../components/AddItem.js";
import SummariesSlider from "../components/SummariesSlider.js";

function EditorDashboard() {
  return (
    <VStack width="100%" mb={8}>
      <Flex
        width="100vw"
        py={5}
        px={{ base: 30, lg: 45 }}
        maxH="100px"
        position="sticky"
        top="0px"
        left="0px"
        zIndex="banner"
        bg="white"
        borderBottomWidth="2px"
        borderColor="gray.200"
        boxShadow="sm"
        justify="center"
        align="center"
      >
        <TopSec />
      </Flex>
      <VStack width="100%" pt={{ base: "20px", md: "30px" }}>
        <Box
          width={{ base: "85%", md: "75%", "2xl": "85%" }}
          display="flex"
          justify="center"
          mb={{ base: "20px", xl: "30px" }}
          bg="white"
          borderColor="gray.200"
          borderWidth="2px"
          borderRadius="xl"
          boxShadow="sm"
        >
          <AddItem />
        </Box>
        <Flex
          width={{ base: "90%", md: "85%", "2xl": "90%" }}
          mb={{ base: 5, md: 10 }}
          borderColor="gray.200"
          boxShadow="sm"
          borderWidth="2px"
          borderRadius="xl"
          justify="center"
          align="center"
          bg="white"
        >
          <SummariesSlider />
        </Flex>
      </VStack>
    </VStack>
  );
}

export default EditorDashboard;
