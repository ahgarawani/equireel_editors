import { VStack } from "@chakra-ui/react";
import TopSec from "../components/TopSec.js";
import AddItem from "../components/AddItem.js";
import SummeriesSlider from "../components/SummeriesSlider.js";

function EditorDashboard() {
  return (
    <VStack bg="#fafafa" minH="100vh">
      <TopSec dashboard="editor" />
      <AddItem />
      <SummeriesSlider />
    </VStack>
  );
}

export default EditorDashboard;
