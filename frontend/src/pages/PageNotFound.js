import { Flex, Heading } from "@chakra-ui/react";

function PageNotFound() {
  return (
    <Flex
      width="100%"
      height="80vh"
      justifyContent="center"
      alignItems="center"
    >
      <Heading textAlign="center">Oops! This page doesn't exist!</Heading>
    </Flex>
  );
}

export default PageNotFound;
