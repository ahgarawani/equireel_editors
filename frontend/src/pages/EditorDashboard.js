import { Flex, Box } from "@chakra-ui/react";
import TopSec from "../components/TopSec.js";
import AddItem from "../components/AddItem.js";
import SummeriesSlider from "../components/SummeriesSlider.js";

function EditorDashboard() {
  return (
    <Flex
      bg="#fafafa"
      minH="100vh"
      minW="100vw"
      direction="column"
      align="center"
    >
      <Box
        width="100vw"
        py={5}
        px={{ base: 30, lg: 45 }}
        maxH="100px"
        position="fixed"
        zIndex="banner"
        bg="white"
        borderBottomWidth="2px"
        borderColor="gray.200"
        boxShadow="sm"
        display="flex"
        justify="center"
        align="center"
      >
        <TopSec dashboard="editor" />
      </Box>

      <Box
        width={{ base: "85%", md: "75%", "2xl": "85%" }}
        justify="center"
        mt={{ base: "120px", lg: "140px" }}
        mb={{ base: "30px", xl: "40px" }}
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
        <SummeriesSlider />
      </Flex>
    </Flex>
  );
}

export default EditorDashboard;
