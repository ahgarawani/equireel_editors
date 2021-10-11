import { Flex, Button, Heading } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";

import { IoIosArrowBack } from "react-icons/io";

function ErrorPage({ message }) {
  let history = useHistory();

  return (
    <Flex width="100%" height="100vh" p="10" direction="column">
      <Flex width="100%" justify="start" align="start">
        <Button
          leftIcon={<IoIosArrowBack />}
          variant="link"
          size="lg"
          colorScheme="red"
          onClick={() => history.goBack()}
        >
          Back
        </Button>
      </Flex>
      <Flex width="100%" height="100vh" justify="center" align="center">
        <Heading>Oops! {message}!</Heading>
      </Flex>
    </Flex>
  );
}

export default ErrorPage;
