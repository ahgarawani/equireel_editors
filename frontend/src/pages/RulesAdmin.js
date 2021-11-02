import { Flex, Button } from "@chakra-ui/react";
import { RiAddFill } from "react-icons/ri";
import AddRuleForm from "../components/AddRuleForm";
import ModalWithOpener from "../components/ModalWithOpener";
import RulesItems from "../components/RulesItems";

export default function RulesAdmin() {
  return (
    <Flex width="100%" justify="center" align="center" direction="column">
      <Flex
        width="90%"
        p="4"
        mb={{ base: 5, md: 10 }}
        borderColor="gray.200"
        boxShadow="sm"
        borderWidth="2px"
        borderRadius="xl"
        flexDir="column"
        justify="center"
        align="center"
        bg="white"
      >
        <RulesItems />
        <ModalWithOpener
          modalOpener={
            <Button
              colorScheme="red"
              rightIcon={<RiAddFill />}
              mt={8}
              variant="ghost"
              size="lg"
              borderRadius="xl"
            >
              Add New Rule
            </Button>
          }
          modalHeader="Add A New Rule!"
          size="3xl"
          scrollBehavior="inside"
        >
          <AddRuleForm />
        </ModalWithOpener>
      </Flex>
    </Flex>
  );
}
