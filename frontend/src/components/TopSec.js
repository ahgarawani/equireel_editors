import {
  Heading,
  Flex,
  ButtonGroup,
  IconButton,
  Button,
  Spacer,
  Box,
  useDisclosure,
} from "@chakra-ui/react";
import { IoSettingsSharp } from "react-icons/io5";
import { HiOutlineLogout, HiSearch } from "react-icons/hi";

import ComponentGate from "./ComponentGate.js";

import { logout, useAuthState, useAuthDispatch } from "../contexts";
import { useHistory } from "react-router-dom";
import SearchBoxModal from "./SearchBoxModal.js";

function TopSec({ dashboard }) {
  const dispatch = useAuthDispatch(); // read dispatch method from context
  const currentUser = useAuthState(); //read user details from context
  const history = useHistory();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleLogout = () => {
    logout(dispatch); //call the logout action
  };

  return (
    <Flex
      direction="row"
      width="100%"
      pt={6}
      pb={5}
      px={45}
      position="fixed"
      zIndex="banner"
      bg="white"
      borderBottomWidth="2px"
      borderColor="gray.200"
      boxShadow="sm"
    >
      <Box>
        <Heading color="red.500">EQUIREEL EDITORS</Heading>
      </Box>
      <Spacer />
      <Box>
        <ButtonGroup
          isRound="true"
          size="lg"
          colorScheme="red"
          spacing="6"
          bg="white"
        >
          <Button
            isActive={dashboard === "editor"}
            _active={{ bg: "red.500" }}
            variant={dashboard === "editor" ? "solid" : "ghost"}
            onClick={() => {
              history.push(`/`);
            }}
          >
            Editor Dashboard
          </Button>
          <ComponentGate role="admin">
            <Button
              isActive={dashboard === "admin"}
              _active={{ bg: "red.500" }}
              variant={dashboard === "admin" ? "solid" : "ghost"}
              onClick={() => {
                history.push(`/admin`);
              }}
            >
              Admin Dashboard
            </Button>
          </ComponentGate>
        </ButtonGroup>
      </Box>
      <Spacer />
      <Box display="flex" direction="row">
        <Box mr="4">
          <Heading size="lg">{currentUser.userDetails.name}</Heading>
        </Box>
        <IconButton
          icon={<HiSearch />}
          isRound="true"
          size="md"
          colorScheme="red"
          variant="outline"
          bg="white"
          mr="4"
          onClick={onOpen}
        />
        <SearchBoxModal modalControls={{ isOpen: isOpen, onClose: onClose }} />
        <IconButton
          icon={<HiOutlineLogout />}
          isRound="true"
          size="md"
          colorScheme="red"
          variant="outline"
          bg="white"
          mr="4"
          onClick={handleLogout}
        />
        {/* <IconButton
          aria-label="settings"
          icon={<IoSettingsSharp />}
          isRound="true"
          size="lg"
          colorScheme="red"
          variant="outline"
        /> */}
      </Box>
    </Flex>
  );
}

export default TopSec;
