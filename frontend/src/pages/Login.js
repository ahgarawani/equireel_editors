import { useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Flex,
  VStack,
  Heading,
  Input,
  Button,
  Alert,
  AlertIcon,
  Spinner,
} from "@chakra-ui/react";

import { loginUser, useAuthState, useAuthDispatch } from "../contexts";

function Login() {
  const [email, setEmail] = useState("");

  const dispatch = useAuthDispatch();
  const currentUser = useAuthState(); //read the values of loading and errorMessage from context

  const history = useHistory();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      let response = await loginUser(dispatch, { email });
      if (!response.user) {
        return;
      }
      history.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Flex
      width="100%"
      height="100vh"
      justifyContent="center"
      alignItems="center"
      bg="#fafafa"
    >
      {currentUser.loading ? (
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="red.500"
          size="xl"
        />
      ) : (
        <VStack
          width="100%"
          maxW={{ base: "90vw", sm: "80vw", md: "60vw", lg: "40vw" }}
          py={10}
          borderColor="gray.300"
          borderWidth="1px"
          borderRadius="lg"
          boxShadow="md"
          spacing="12"
          justifyContent="center"
          bg="white"
        >
          {currentUser.errorMessage ? (
            <Alert status="error" fontWeight="semibold">
              <AlertIcon />
              {currentUser.errorMessage} Try Again.
            </Alert>
          ) : (
            <></>
          )}
          <Heading color="red.500">Login</Heading>
          <VStack spacing="5" width="100%">
            <Input
              placeholder="Email"
              focusBorderColor="red.500"
              width="60%"
              isRequired
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Heading size="sm" w="85%" textAlign="center">
              To test the website: login using this email: guest@demo.com
            </Heading>
          </VStack>

          <Button
            colorScheme="red"
            onClick={handleLogin}
            disabled={currentUser.loading}
          >
            Login
          </Button>
        </VStack>
      )}
    </Flex>
  );
}

export default Login;
