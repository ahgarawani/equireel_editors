import { useRef } from "react";
import {
  Heading,
  Image,
  Flex,
  ButtonGroup,
  IconButton,
  Button,
  Spacer,
  Box,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
//import { IoSettingsSharp } from "react-icons/io5";
import { HiOutlineLogout, HiSearch, HiPencil } from "react-icons/hi";
import { RiAdminFill } from "react-icons/ri";
import { TiThMenu } from "react-icons/ti";

import ComponentGate from "./ComponentGate.js";

import { logout, useAuthState, useAuthDispatch } from "../contexts";
import { useHistory } from "react-router-dom";
import SearchBoxModal from "./SearchBoxModal.js";

function ButtonsCluster({
  dashboard,
  history,
  currentUser,
  openSearchModal,
  handleLogout,
  display,
}) {
  return (
    <>
      <Box display={display}>
        <ButtonGroup borderRadius="full" size="lg" colorScheme="red" bg="white">
          <Button
            leftIcon={<HiPencil />}
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
              leftIcon={<RiAdminFill />}
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
      <Spacer display={display} />
      <Box display={display}>
        <Heading size="lg" mr="5">
          {currentUser.userDetails.name}
        </Heading>
        <ButtonGroup size="md" colorScheme="red" variant="outline">
          <IconButton
            borderRadius="full"
            icon={<HiSearch />}
            onClick={openSearchModal}
          />
          {/* <IconButton borderRadius="full" icon={<IoSettingsSharp />} /> */}
          <IconButton
            borderRadius="full"
            icon={<HiOutlineLogout />}
            onClick={handleLogout}
          />
        </ButtonGroup>
      </Box>
    </>
  );
}

function DrawerNavButton({
  dashboard,
  history,
  currentUser,
  openSearchModal,
  handleLogout,
  display,
}) {
  const {
    isOpen: drawerNavIsOpen,
    onOpen: openDrawerNav,
    onClose: closeDrawerNav,
  } = useDisclosure();
  const btnRef = useRef();
  return (
    <>
      <Box display={display}>
        <Heading size="lg">{currentUser.userDetails.name}</Heading>
      </Box>
      <Spacer display={display} />
      <Box display={display}>
        <IconButton
          ref={btnRef}
          icon={<TiThMenu />}
          colorScheme="red"
          variant="ghost"
          textSize="50px"
          onClick={openDrawerNav}
        />
      </Box>
      <Drawer
        isOpen={drawerNavIsOpen}
        placement="right"
        onClose={closeDrawerNav}
        finalFocusRef={btnRef}
        size="sm"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton colorScheme="red" />
          <DrawerHeader>Navigate</DrawerHeader>
          <DrawerBody>
            <ButtonGroup
              as="a"
              size="lg"
              colorScheme="red"
              variant="link"
              flexDir="column"
            >
              <Box></Box>
              <Button
                mb={8}
                width="100%"
                justifyContent="flex-start"
                leftIcon={<HiPencil />}
                onClick={() => {
                  history.push(`/`);
                }}
                isDisabled={dashboard === "editor"}
                _disabled={{ fontWeight: "extrabold", color: "red.500" }}
              >
                Editor Dashboard
              </Button>
              <ComponentGate role="admin">
                <Button
                  mb={8}
                  width="100%"
                  justifyContent="flex-start"
                  leftIcon={<RiAdminFill />}
                  onClick={() => {
                    history.push(`/admin`);
                  }}
                  isDisabled={dashboard === "admin"}
                  _disabled={{ fontWeight: "extrabold", color: "red.500" }}
                >
                  Admin Dashboard
                </Button>
              </ComponentGate>
              <Button
                mb={8}
                width="100%"
                justifyContent="flex-start"
                leftIcon={<HiSearch />}
                onClick={openSearchModal}
              >
                Search
              </Button>
              <Button
                mb={8}
                width="100%"
                justifyContent="flex-start"
                leftIcon={<HiOutlineLogout />}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </ButtonGroup>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

function TopSec({ dashboard }) {
  const dispatch = useAuthDispatch(); // read dispatch method from context
  const currentUser = useAuthState(); //read user details from context
  const history = useHistory();

  const {
    isOpen: searchModalIsOpen,
    onOpen: openSearchModal,
    onClose: closeSearchModal,
  } = useDisclosure();

  const handleLogout = () => {
    logout(dispatch); //call the logout action
  };

  return (
    <Flex align="center" width="100%" height="100%">
      <Box display="flex" flexShrink={0} justify="center" align="center">
        <Image
          objectFit="cover"
          boxSize={{ base: "40px", xl: "50px" }}
          src="/images/EE_LOGO.svg"
          mr={5}
        />
        <Heading display={{ base: "none", xl: "inline-block" }} color="red.500">
          EQUIREEL EDITORS
        </Heading>
      </Box>
      <Spacer display={{ base: "none", lg: "inline-block" }} />
      <ButtonsCluster
        dashboard={dashboard}
        history={history}
        currentUser={currentUser}
        openSearchModal={openSearchModal}
        handleLogout={handleLogout}
        display={{ base: "none", lg: "flex" }}
      />

      <Spacer display={{ base: "inline-block", lg: "none" }} />

      <DrawerNavButton
        dashboard={dashboard}
        history={history}
        currentUser={currentUser}
        openSearchModal={openSearchModal}
        handleLogout={handleLogout}
        display={{ base: "flex", lg: "none" }}
      />

      <SearchBoxModal
        modalControls={{
          isOpen: searchModalIsOpen,
          onClose: closeSearchModal,
        }}
      />
    </Flex>
  );
}

export default TopSec;
