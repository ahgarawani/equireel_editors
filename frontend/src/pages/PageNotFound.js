import { Flex, Heading } from "@chakra-ui/react";

function PageNotFound() {
  return (
    <Flex
      width="100%"
      height="100vh"
      justifyContent="center"
      alignItems="center"
    >
      <Heading>Oops! This page doesn't exist!</Heading>
    </Flex>
  );
}

export default PageNotFound;
